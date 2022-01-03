import { MockSTDIN, stdin } from 'mock-stdin'
import { promptQuestions } from '../utils/promptQuestions'
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

const invalidGeneratorNames = {
  '#invalid@pkgname': { errorMsg: "isn't a valid package name!" },
  'my-gen': { errorMsg: 'prisma-generator-<custom-name>' },
  'prisma-generator': { errorMsg: 'prisma-generator-<custom-name>' },
  'prisma-generator-': { errorMsg: 'prisma-generator-<custom-name>' },
}

Object.keys(invalidGeneratorNames).forEach((invalidPkgName) => {
  test(`shouldn't accept ${invalidPkgName} as a package name`, async () => {
    const sendKeystrokes = async () => {
      await answer(io, { text: invalidPkgName })

      await delay(10)

      clearInput(io, invalidPkgName.length)
      await answer(io, { text: 'prisma-generator-data-graph' })

      // Skip the rest of the questions
      await skipQuestions(-1, io)
    }
    setTimeout(() => sendKeystrokes().then(), 5)
    await promptQuestions()

    expect(spy.console.mock.calls.toString()).toContain(
      invalidGeneratorNames[
        invalidPkgName as keyof typeof invalidGeneratorNames
      ].errorMsg,
    )
  })
})
