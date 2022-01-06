import { MockSTDIN, stdin } from 'mock-stdin'
import { promptQuestions } from '../utils/inquirer/promptQuestions'
import { validGenName } from './constants/valid-prisma-gen-name'
import { answer } from './__helpers__/answer'
import { clearInput } from './__helpers__/clearInput'
import { delay } from './__helpers__/delay'
import { skipQuestions } from './__helpers__/skipQuestions'
import { spyConsole } from './__helpers__/spyConsole'

// Mock stdin to send keystrokes to the CLI
let io: MockSTDIN
beforeEach(() => (io = stdin()))
afterEach(() => io.restore())

let spy = spyConsole()

const skipFlag = '--skip-check'

const validNonPrismaConventionGeneratorNames = [
  'new-prisma_generator',
  'my-generator',
  '@org/my-generator',
]

const errorMessages = [
  'prisma-generator-<custom-name>',
  "isn't a valid package name!",
]

validNonPrismaConventionGeneratorNames.forEach((invalidPkgName) => {
  test(`should skip prisma's naming convention when ${skipFlag} flag is used`, async () => {
    const sendKeystrokes = async () => {
      await answer(io, { text: invalidPkgName + ` ${skipFlag}` })

      await delay(10)

      clearInput(io, invalidPkgName.length)
      await answer(io, { text: validGenName })

      // Skip the rest of the questions
      await skipQuestions(-1, io)
    }
    setTimeout(() => sendKeystrokes().then(), 5)
    await promptQuestions()

    const numberOfMatchingErrors = errorMessages.filter(
      (x) => spy.console.mock.calls.toString().indexOf(x) > -1,
    ).length
    expect(numberOfMatchingErrors).toEqual(0)
  })
})
