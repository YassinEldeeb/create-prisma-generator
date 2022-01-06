import { MockSTDIN, stdin } from 'mock-stdin'
import { promptQuestions } from '../utils/inquirer/promptQuestions'
import { skipQuestions } from './__helpers__/skipQuestions'
import { answer } from './__helpers__/answer'
import { validGenName } from './constants/valid-prisma-gen-name'

// Mock stdin to send keystrokes to the CLI
let io: MockSTDIN
beforeEach(() => (io = stdin()))
afterEach(() => io.restore())

// See the Questions to know how to modify these samples
// LINK ..\utils\promptQuestions.ts#questions

let genName = validGenName
const sampleAnswers = {
  async sample1() {
    // LINK ..\utils\promptQuestions.ts#Q1-generatorName
    await answer(io, { text: `  ${genName}    ` })

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
    await answer(io, { keys: ['down'] })

    // LINK ..\utils\promptQuestions.ts#Q4-usingGithubActions
    await answer(io, { text: 'No' })

    // Skip the rest of the questions
    await skipQuestions(-1, io)
  },
  async sample4() {
    // LINK ..\utils\promptQuestions.ts#Q1-generatorName
    await answer(io, { text: 'my-gen --skip-check' })

    // Skip the rest of the questions
    await skipQuestions(2, io)
    await skipQuestions(-1, io, true)
  },
}

Object.keys(sampleAnswers).map((answer) => {
  test(`should get proper answers object when answering using ${answer}`, async () => {
    setTimeout(
      () => sampleAnswers[answer as keyof typeof sampleAnswers]().then(),
      5,
    )
    const answers = await promptQuestions()

    expect(answers).toMatchSnapshot()
  })
})
