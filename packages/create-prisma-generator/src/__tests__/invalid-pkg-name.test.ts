import { MockSTDIN, stdin } from 'mock-stdin'
import { promptQuestions, questions } from '../utils/promptQuestions'
import { keys } from './__helpers__/keyCodes'
import { delay } from './__helpers__/delay'
import { clearInput } from './__helpers__/clearInput'
import { spyConsole } from './__helpers__/spyConsole'
import { skipQuestions } from './__helpers__/skipQuestions'

// Mock stdin to send keystrokes to the CLI
let io: MockSTDIN
beforeAll(() => (io = stdin()))
afterAll(() => io.restore())

let spy = spyConsole()

test("shouldn't accept invalid package name", async () => {
  const sendKeystrokes = async () => {
    const invalidPkgName = '#invalid@pkgname'
    io.send(invalidPkgName)
    io.send(keys.enter)

    await delay(10)

    clearInput(io, invalidPkgName.length)
    io.send('validname')
    io.send(keys.enter)

    // Skip the rest of the questions
    skipQuestions(-1, io)
  }
  setTimeout(() => sendKeystrokes().then(), 5)
  await promptQuestions()

  expect(spy.console.mock.calls.toString()).toContain(
    "isn't a valid package name!",
  )
})
