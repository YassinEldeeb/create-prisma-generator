import { MockSTDIN, stdin } from 'mock-stdin'
import { promptQuestions } from '../utils/promptQuestions'
import { skipQuestions } from './__helpers__/skipQuestions'
import { answer } from './__helpers__/answer'

// Mock stdin to send keystrokes to the CLI
let io: MockSTDIN
beforeEach(() => (io = stdin()))
afterEach(() => io.restore())

// See the Questions to know how to modify these samples
// LINK ..\utils\promptQuestions.ts#questions

const sampleAnswers = {
  async sample1() {
    // LINK ..\utils\promptQuestions.ts#Q1-generatorName
    answer(io, { text: 'validname' })

    // Skip the rest of the questions
    skipQuestions(-1, io)
  },
  async sample2() {
    // LINK ..\utils\promptQuestions.ts#Q1-generatorName
    answer(io, { text: 'validname' })

    // Skip the rest of the questions
    skipQuestions(-1, io, true)
  },
  async sample3() {
    // LINK ..\utils\promptQuestions.ts#Q1-generatorName
    answer(io, { text: 'validname' })

    // LINK ..\utils\promptQuestions.ts#Q2-usingTypescript
    answer(io, { text: 'No' })

    // LINK ..\utils\promptQuestions.ts#Q3-selectPkgManager
    answer(io, { keys: ['up'] })

    // LINK ..\utils\promptQuestions.ts#Q4-usingGithubActions
    answer(io)

    // Skip the rest of the questions
    skipQuestions(-1, io, true)
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
