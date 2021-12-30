import { MockSTDIN } from 'mock-stdin'
import { questions } from '../../utils/promptQuestions'
import { delay } from './delay'
import { keys } from './keyCodes'

export const skipQuestions = async (numOfSkips: number, io: MockSTDIN) => {
  for (
    let i = 0;
    i < (numOfSkips === -1 ? questions.length : numOfSkips);
    i++
  ) {
    await delay(10)
    io.send(keys.enter)
  }
}
