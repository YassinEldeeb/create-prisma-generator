import { MockSTDIN, stdin } from 'mock-stdin'
import { promptQuestions } from '../utils/promptQuestions'
import { answer } from './__helpers__/answer'
import { clearInput } from './__helpers__/clearInput'
import { delay } from './__helpers__/delay'
import { skipQuestions } from './__helpers__/skipQuestions'
import { spyConsole } from './__helpers__/spyConsole'

// Mock stdin to send keystrokes to the CLI
let io: MockSTDIN
beforeAll(() => (io = stdin()))
afterAll(() => io.restore())

let spy = spyConsole()

test("shouldn't accept invalid package name", async () => {
  const sendKeystrokes = async () => {
    const invalidPkgName = '#invalid@pkgname'
    await answer(io, { text: invalidPkgName })

    await delay(10)

    clearInput(io, invalidPkgName.length)
    await answer(io, { text: 'validname' })

    // Skip the rest of the questions
    await skipQuestions(-1, io)
  }
  setTimeout(() => sendKeystrokes().then(), 5)
  await promptQuestions()

  expect(spy.console.mock.calls.toString()).toContain(
    "isn't a valid package name!",
  )
})
