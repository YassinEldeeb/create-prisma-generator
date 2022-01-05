import { MockSTDIN, stdin } from 'mock-stdin'
import { spyConsole } from './__helpers__/spyConsole'
import { main } from '../index'
import { answer } from './__helpers__/answer'
import { skipQuestions } from './__helpers__/skipQuestions'
import path from 'path'
import fs from 'fs'
import { validGenName } from './constants/valid-prisma-gen-name'

// Mock stdin to send keystrokes to the CLI
let io: MockSTDIN
beforeAll(() => {
  // Check if validname directory exists before running the Tests
  if (!fs.existsSync(path.join(__dirname, `${validGenName}`))) {
    throw new Error(
      `'${validGenName}' directory should be placed under:\n ${__dirname}`,
    )
  }
  io = stdin()
})
afterAll(() => io.restore())

let spy = spyConsole()

// Mocking fs & child_process to avoid actually
// setting up the project if the test failed
jest.mock('fs')
jest.mock('child_process')

test("shouldn't start setting up the project if the directory already exists", async () => {
  const sendKeystrokes = async () => {
    await answer(io, { text: validGenName })
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
