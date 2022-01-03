import { MockSTDIN, stdin } from 'mock-stdin'
import { promptQuestions } from '../utils/promptQuestions'
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

const validGeneratorNames = [validGenName, `@org/${validGenName}`]
const errorMessages = [
  'prisma-generator-<custom-name>',
  "isn't a valid package name!",
]

validGeneratorNames.forEach((invalidPkgName) => {
  test(`shouldn't accept ${invalidPkgName} as a generator name`, async () => {
    const sendKeystrokes = async () => {
      await answer(io, { text: invalidPkgName })

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
