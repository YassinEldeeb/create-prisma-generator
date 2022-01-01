import { MockSTDIN, stdin } from 'mock-stdin'
import { main } from '../index'
import { answer } from './__helpers__/answer'
import { skipQuestions } from './__helpers__/skipQuestions'
import fs from 'fs'
import path from 'path'
import memfs from 'memfs'
import { MockedFS } from './types/MockedFS'
import child_process from 'child_process'

const mockedFS: MockedFS = fs as any

// Mock stdin to send keystrokes to the CLI
let io: MockSTDIN
beforeAll(() => {
  io = stdin()
})

afterAll(() => {
  io.restore()
  mockedFS.reset()
})

jest.mock('fs', () => {
  const { Volume } = require('memfs') as typeof memfs
  const fsModule = jest.requireActual(`fs`) as typeof fs
  const pathModule = jest.requireActual(`path`) as typeof path

  const packagesPath = pathModule.join(__dirname, '../../../')
  const packages = fsModule
    .readdirSync(packagesPath, { withFileTypes: true })
    .filter((dirent: any) => dirent.isDirectory())

  const InitialFSJSONSetup = {}
  // Setup in-memory `fs`
  packages.forEach((pkg: fs.Dirent) => {
    const blacklistedPackages = ['create-prisma-generator', 'cli-usage']
    if (blacklistedPackages.includes(pkg.name)) {
      return
    }

    function* walkSync(dir: string): any {
      const files = fsModule.readdirSync(dir, { withFileTypes: true })
      for (const file of files) {
        if (file.isDirectory()) {
          yield* walkSync(pathModule.join(dir, file.name))
        } else {
          yield pathModule.join(dir, file.name)
        }
      }
    }

    for (const filePath of walkSync(pathModule.join(packagesPath, pkg.name))) {
      const blackListedFolders = ['node_modules']
      const is_blacklisted =
        blackListedFolders.findIndex((bl) => filePath.indexOf(bl) > -1) > -1
      if (!is_blacklisted) {
        const mustHaveContent = ['.yml', 'package.json']

        const fileContent =
          filePath.includes(
            pathModule.join(packagesPath, pkg.name, 'template'),
          ) && mustHaveContent.findIndex((e) => filePath.includes(e)) === -1
            ? ''
            : fsModule.readFileSync(filePath, 'utf-8')

        // @ts-ignore
        InitialFSJSONSetup[filePath] = fileContent
      }
    }
  })

  // @ts-ignore
  InitialFSJSONSetup[
    pathModule.join(packagesPath, 'create-prisma-generator/file.txt')
  ] = ''
  const vol = Volume.fromJSON(InitialFSJSONSetup)

  ;(vol as any).actual = fsModule

  return vol
})

jest.mock('child_process', () => {
  return {
    execSync: (cmd: string) => {
      if (cmd.includes('@cpg-cli/')) {
        const pkgName =
          'cpg-' +
          cmd.split(' ')[1].replace('@cpg-cli/', '').replace('@latest', '')

        // Pass arguments to the Tiny CLIs
        process.argv[2] = cmd.split(' ')[2]
        process.argv[3] = cmd.split(' ')[3]

        const CLIIndexAbsolutePath = path.join(
          __dirname,
          `../../../${pkgName}`,
          'index.js',
        )
        const relativePath = path.relative(__dirname, CLIIndexAbsolutePath)

        // Execute the tiny CLI
        require(relativePath)
      }
    },
    spawn: () => ({
      on() {},
    }),
  }
})

jest.spyOn(child_process, 'spawn')

test('check the full generated boilerplate', async () => {
  // If genName changed, fs-snapshot has to be deleted
  // to update the fs in-memory snapshot
  const genName = 'my-best-prisma-gen'
  const sendKeystrokes = async () => {
    await answer(io, { text: genName })

    // Skip the rest of the questions
    await skipQuestions(-1, io)
  }

  setTimeout(() => sendKeystrokes().then(), 5)

  await main()

  const fsSnapshot = mockedFS.toJSON()
  const newSnapshot = Object.keys(fsSnapshot)
    .filter((key) => {
      // Removing the first (n)th chars as a treshold
      // for slicing the drive prefix on different OSs
      // cause `memfs` stores files paths without drive prefix
      const condition = path.join(process.cwd(), genName).slice(5)
      return path.join(key).includes(condition)
    })
    .reduce((cur, key) => {
      return Object.assign(cur, { [key]: '' })
    }, {})

  const snapshotPath = path.join(
    __dirname,
    '__in-memory-fs-snapshots__/full-boilerplate.json',
  )
  const lastSnapshot = mockedFS.actual.existsSync(snapshotPath)
    ? JSON.parse(mockedFS.actual.readFileSync(snapshotPath, 'utf-8'))
    : null

  // Check if any files are missing
  if (lastSnapshot) {
    const missingFiles: string[] = []
    Object.keys(lastSnapshot).forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(newSnapshot, key)) {
        missingFiles.push(genName + key.split(genName)[1])
      }
    })

    expect(
      missingFiles,
      "Missing Files! delete the snapshot to update it if you're sure that's okay.",
    ).toEqual([])
  }

  // Delete snapshot to be Updated
  if (!lastSnapshot) {
    // Write in-memory fs JSON
    mockedFS.actual.writeFileSync(
      snapshotPath,
      JSON.stringify(newSnapshot, null, 2),
    )
  }

  // Treshold of 5 more files, anything more than that
  // is considered too much boilerplate
  const lastSnapshotLength = lastSnapshot ? Object.keys(lastSnapshot).length : 0
  const newSnapshotLength = Object.keys(newSnapshot).length
  const filesNumDiff = newSnapshotLength - lastSnapshotLength
  expect(
    filesNumDiff,
    'This is too much boilerplate for just starting a project',
  ).toBeLessThanOrEqual(5)

  // Check deps installtion
  expect(child_process.spawn).toHaveBeenCalledWith('pnpm i', {
    cwd: path.join(process.cwd(), genName),
    shell: true,
    stdio: 'inherit',
  })
})
