// --------------------------------------------------------------------------------
// This is the BEAST test suit that's responsible for
// checking the full generated boilerplate from 7 different CLIs
// running on a virtual in-memory file-system
// --------------------------------------------------------------------------------
import { MockSTDIN, stdin } from 'mock-stdin'
import { main } from '../index'
import { answer } from './__helpers__/answer'
import { skipQuestions } from './__helpers__/skipQuestions'
import fs from 'fs'
import path from 'path'
import memfs from 'memfs'
import { MockedFS } from './types/MockedFS'
import child_process from 'child_process'
import { getInstallCommand } from '../utils/getInstallCommands'

const mockedFS: MockedFS = fs as any

let io: MockSTDIN
beforeEach(() => {
  io = stdin()
})

afterEach(async () => {
  mockedFS.goBackToInitialSetup()
  io.restore()
})

afterAll(() => mockedFS.reset())

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
  ;(vol as any).goBackToInitialSetup = () => {
    vol.reset()
    vol.fromJSON(InitialFSJSONSetup)
  }

  return vol
})

jest.mock('child_process', () => {
  return {
    execSync: async (cmd: string) => {
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
          'setup.js',
        )
        const relativePath = path.relative(__dirname, CLIIndexAbsolutePath)

        // Execute the tiny CLI by importing it
        // then calling the default exported function
        require(relativePath)()
      }
    },
    spawnSync: () => '',
  }
})

jest.spyOn(child_process, 'spawnSync')

// If genName changed, fs-snapshot has to be deleted
// to update the fs in-memory snapshot
const genName = 'my-best-prisma-gen'

const sampleAnswers = {
  async sample1() {
    // LINK ..\utils\promptQuestions.ts#Q1-generatorName
    await answer(io, { text: genName })

    // Skip the rest of the questions
    await skipQuestions(-1, io)
  },
  async sample2() {
    // LINK ..\utils\promptQuestions.ts#Q1-generatorName
    await answer(io, { text: genName })

    // Skip the rest of the questions
    await skipQuestions(-1, io, true)
  },
  async sample3() {
    // LINK ..\utils\promptQuestions.ts#Q1-generatorName
    await answer(io, { text: genName })

    // LINK ..\utils\promptQuestions.ts#Q2-usingTypescript
    await answer(io, { text: 'No' })

    // LINK ..\utils\promptQuestions.ts#Q3-selectPkgManager
    await answer(io, { keys: ['up'] }) // > yarn

    // LINK ..\utils\promptQuestions.ts#Q4-usingGithubActions
    await answer(io)

    // Skip the rest of the questions
    await skipQuestions(-1, io, true)
  },
  async sample4() {
    // LINK ..\utils\promptQuestions.ts#Q1-generatorName
    await answer(io, { text: genName })

    // LINK ..\utils\promptQuestions.ts#Q2-usingTypescript
    await answer(io, { text: 'No' })

    // LINK ..\utils\promptQuestions.ts#Q3-selectPkgManager
    await answer(io, { keys: ['down'] }) // > npm

    // LINK ..\utils\promptQuestions.ts#Q4-usingGithubActions
    await answer(io, { text: 'No' })

    // Skip the rest of the questions
    await skipQuestions(-1, io)
  },
  async sample5() {
    // LINK ..\utils\promptQuestions.ts#Q1-generatorName
    await answer(io, { text: genName })

    // LINK ..\utils\promptQuestions.ts#Q2-usingTypescript
    await answer(io)

    // LINK ..\utils\promptQuestions.ts#Q3-selectPkgManager
    await answer(io, { keys: ['up'] }) // > yarn

    // LINK ..\utils\promptQuestions.ts#Q4-usingGithubActions
    await answer(io)

    // Skip the rest of the questions
    await skipQuestions(-1, io, true)
  },
}
const pkgManager = {
  sample1: 'pnpm',
  sample2: 'pnpm',
  sample3: 'yarn',
  sample4: 'npm',
  sample5: 'yarn',
}

Object.keys(sampleAnswers).map((sample) => {
  test(`check the output with ${sample}`, async () => {
    setTimeout(
      () => sampleAnswers[sample as keyof typeof sampleAnswers]().then(),
      5,
    )

    const answers = await main()

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
        return Object.assign(cur, {
          [path.join(genName, key.split(genName)[1])]: '',
        })
      }, {})

    const snapshotPath = path.join(
      __dirname,
      `__in-memory-fs-snapshots__/output-from-${sample}.json`,
    )
    const lastSnapshot = mockedFS.actual.existsSync(snapshotPath)
      ? JSON.parse(mockedFS.actual.readFileSync(snapshotPath, 'utf-8')).snapshot
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
        `Missing Files! If this was intentional delete 'output-from-${sample}.json' snapshot to update it.`,
      ).toEqual([])
    }

    // Delete snapshot to be Updated
    if (!lastSnapshot) {
      // Write in-memory fs JSON
      mockedFS.actual.writeFileSync(
        snapshotPath,
        JSON.stringify({ answers, fsSnapshot: newSnapshot }, null, 2),
      )
    }

    // Treshold of 5 more files, anything more than that
    // is considered too much boilerplate
    const lastSnapshotLength = lastSnapshot
      ? Object.keys(lastSnapshot).length
      : 0

    if (lastSnapshotLength > 0) {
      const newSnapshotLength = Object.keys(newSnapshot).length
      const filesNumDiff = newSnapshotLength - lastSnapshotLength
      expect(
        filesNumDiff,
        'This is too much boilerplate for just starting a project!',
      ).toBeLessThanOrEqual(5)
    }

    const installCommand = getInstallCommand(
      pkgManager[sample as keyof typeof pkgManager] as any,
    )
    // Check deps installtion
    expect(child_process.spawnSync).toHaveBeenCalledWith(installCommand, {
      cwd: path.join(process.cwd(), genName),
      shell: true,
      stdio: 'inherit',
    })
  })
})
