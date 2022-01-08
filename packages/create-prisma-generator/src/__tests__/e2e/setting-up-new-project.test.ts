// TODO: run all tests in parallel in separate processes Using multiple threads
import { MockSTDIN, stdin } from 'mock-stdin'
import { validGenName } from '../constants/valid-prisma-gen-name'
import { answer } from '../__helpers__/answer'
import { skipQuestions } from '../__helpers__/skipQuestions'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { main } from '../..'
import { execSync } from 'child_process'
import ci from 'ci-info'

let io: MockSTDIN
let tempDirPath: string
let initialCWD: string

beforeEach(() => {
  io = stdin()

  // Create temp folder in the same project folder if in CI env.
  // Github Actions: `EACCES: permission denied, mkdtemp '/tmpXXXXXX'`
  // Issue: https://github.com/actions/toolkit/issues/518
  if (ci.isCI) {
    const tempPath = path.join(process.cwd(), 'temp')
    fs.mkdirSync(path.join(process.cwd(), 'temp'))
    tempDirPath = tempPath
  } else {
    tempDirPath = fs.mkdtempSync(fs.realpathSync(os.tmpdir() + path.sep))
  }
  if (!initialCWD) {
    initialCWD = process.cwd()
  }
  process.chdir(tempDirPath)
})

afterEach(() => {
  // Switching to prevous CWD so that we
  // can delete the tmp folder
  process.chdir(initialCWD)
  fs.rmSync(tempDirPath, { recursive: true })
  console.log('Cleaned up temp folder 🧹')
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

const FOUR_MINUTES = 1000 * 60 * 4

Object.keys(sampleAnswers).map((sample) => {
  test(
    `setting up a new prisma generator like a normal user using ${sample}`,
    async () => {
      console.log(`------------------${sample}------------------`)

      setTimeout(
        () => sampleAnswers[sample as keyof typeof sampleAnswers]().then(),
        5,
      )

      const answers = (await main())!
      const { packageManager, usageTemplate } = answers

      // Running some scripts developers usually run after the boilerplate
      const runScript = (
        script: string,
        cwd: string = path.join(process.cwd(), genName),
      ) => {
        let command = ''
        if (packageManager === 'npm') {
          command = `${packageManager} run ${script}`
        } else {
          command = `${packageManager} ${script}`
        }
        execSync(command, { cwd })
      }

      runScript('start')

      // usageTemplate === Using Workspaces
      if (usageTemplate) {
        console.log(`Running generator tests`)
        const generatorPath = path.join(
          process.cwd(),
          genName,
          'packages/generator',
        )
        runScript('test', generatorPath)

        console.log(
          `Running prisma generate to check if generator is linked properly`,
        )
        execSync('npx prisma generate', {
          cwd: path.join(generatorPath, '../usage'),
          stdio: 'inherit',
        })
      } else {
        console.log(`Running generator tests`)
        runScript('test')
      }

      console.log(`Checking if git repo is initalized`)
      execSync('git rev-parse --is-inside-work-tree', {
        cwd: path.join(process.cwd(), genName),
        stdio: 'inherit',
      })
    },
    FOUR_MINUTES,
  )
})
