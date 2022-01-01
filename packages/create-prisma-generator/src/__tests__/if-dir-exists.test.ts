import { MockSTDIN, stdin } from 'mock-stdin'
import { spyConsole } from './__helpers__/spyConsole'
import { main } from '../index'
import { answer } from './__helpers__/answer'
import { skipQuestions } from './__helpers__/skipQuestions'
import path from 'path'
import fs from 'fs'

// Mock stdin to send keystrokes to the CLI
let io: MockSTDIN
beforeAll(() => {
  // Check if validname directory exists before running the Tests
  if (!fs.existsSync(path.join(__dirname, 'validname'))) {
    throw new Error(
      `'validname' directory should be placed under:\n ${__dirname}`,
    )
  }
  io = stdin()
})
afterAll(() => io.restore())

let spy = spyConsole()

test("shouldn't start setting up the project if the directory already exists", async () => {
  const sendKeystrokes = async () => {
    await answer(io, { text: 'validname' })
    // Skip the rest of the questions
    await skipQuestions(-1, io)
  }

  // Change working dir to "/__tests__"
  process.chdir(__dirname)

  setTimeout(() => sendKeystrokes().then(), 5)

  await main()
  expect(spy.console.mock.calls.toString()).toContain(
    'directory already exists',
  )
})
