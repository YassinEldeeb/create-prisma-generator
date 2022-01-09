// TODO: run all tests in parallel in separate processes Using multiple threads
import { MockSTDIN, stdin } from 'mock-stdin'
import { validGenName } from '../constants/valid-prisma-gen-name'
import { answer } from '../__helpers__/answer'
import { skipQuestions } from '../__helpers__/skipQuestions'
import fs from 'fs'
import path from 'path'
import { main } from '../..'
import { execSync, spawnSync } from 'child_process'

let io: MockSTDIN
let tempDirPath: string
let initialCWD: string

beforeAll(() => {
  // Create temp folder in the same workspace.
  // cause:
  // 1. Github Actions: `EACCES: permission denied, mkdtemp '/tmpXXXXXX'`
  //  Issue: https://github.com/actions/toolkit/issues/518
  // 2. I want the tiny CLIs to be in the same running process location
  //  to inherit local packages instead of using the online versions

  const tempPath = path.join(__dirname, '../../../../temp')
  fs.mkdirSync(tempPath, { recursive: true })

  const tempPkgJSON = {
    name: 'temp-for-e2e-testing',
    private: true,
    devDependencies: {
      'create-prisma-generator': 'workspace:*',
      '@cpg-cli/semantic-releases': 'workspace:*',
      '@cpg-cli/github-actions': 'workspace:*',
      '@cpg-cli/template': 'workspace:*',
      '@cpg-cli/template-gen-usage': 'workspace:*',
      '@cpg-cli/template-typescript': 'workspace:*',
      '@cpg-cli/root-configs': 'workspace:*',
    },
  }

  fs.writeFileSync(
    path.join(tempPath, 'package.json'),
    JSON.stringify(tempPkgJSON, null, 2),
  )

  // Link local deps(tiny CLIs)
  spawnSync('pnpm i', {
    shell: true,
    stdio: 'inherit',
    cwd: tempPath,
  })

  tempDirPath = tempPath

  initialCWD = process.cwd()

  process.chdir(tempDirPath)
})

beforeEach(() => {
  io = stdin()
})

afterEach(() => {
  fs.rmSync(path.join(tempDirPath, genName), { recursive: true })
  console.log('Cleaned up previous project folder 🧹')
})

afterAll(() => {
  // Switching to prevous CWD so that we
  // can delete the previous project folder
  process.chdir(initialCWD)
  console.log('Cleaned up temp folder 🧹')
  fs.rmSync(tempDirPath, { recursive: true })
})

const genName = validGenName

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
}

const FOUR_MINUTES = 1000 * 60 * 4

jest.mock('child_process', () => {
  const actualChildProcess = jest.requireActual('child_process')

  return {
    ...actualChildProcess,
    spawnSync: (cmd: string, options?: any) => {
      const installCommands = ['yarn', 'pnpm i', 'npm i']

      const projectPath = path.join(process.cwd(), genName)
      const workspacePath = path.join(projectPath, 'pnpm-workspace.yaml')

      //! Adding empty `pnpm-workspace.yaml` to seperate development workspace
      //! from temp testing workspace when using pnpm
      //? checking for project dir if it exists to avoid running this logic
      //? if spawnSync is being used in one of the teardown functions
      if (
        fs.existsSync(projectPath) &&
        !fs.existsSync(workspacePath) &&
        installCommands.includes(cmd)
      ) {
        fs.writeFileSync(workspacePath, '')
      }

      actualChildProcess.spawnSync(cmd, options)
    },
  }
})

Object.keys(sampleAnswers).map((sample) => {
  test(
    `setting up a new prisma generator like a normal user using ${sample}`,
    async () => {
      console.log(`------------------${sample}------------------`)

      setTimeout(
        () => sampleAnswers[sample as keyof typeof sampleAnswers]().then(),
        5,
      )

      const projectWorkDir = path.join(process.cwd(), genName)

      const answers = (await main())!
      const { packageManager, usageTemplate } = answers

      // Running some scripts developers usually run after the boilerplate
      const runScript = (script: string, cwd: string = projectWorkDir) => {
        let command = ''
        if (packageManager === 'npm') {
          command = `${packageManager} run ${script}`
        } else {
          command = `${packageManager} ${script}`
        }
        execSync(command, { cwd })
      }

      // usageTemplate === Using Workspaces
      if (usageTemplate) {
        console.log(`Running generator tests`)
        const generatorPath = path.join(
          process.cwd(),
          genName,
          'packages/generator',
        )

        runScript('start', generatorPath)
        runScript('test', generatorPath)

        console.log(
          `Running \`prisma generate\` to check if generator is linked properly`,
        )
        execSync('npx prisma generate', {
          cwd: path.join(generatorPath, '../usage'),
          stdio: 'inherit',
        })
      } else {
        runScript('start')
        console.log(`Running generator tests`)
        runScript('test')
      }

      console.log(`Checking if git repo is initalized`)
      execSync('git rev-parse --is-inside-work-tree', {
        cwd: projectWorkDir,
        stdio: 'inherit',
      })
    },
    FOUR_MINUTES,
  )
})
