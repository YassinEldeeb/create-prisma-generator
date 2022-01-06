import { MockSTDIN } from 'mock-stdin'
import { questions } from '../../utils/inquirer/promptQuestions'
import { delay } from '../__helpers__/delay'
import { keys } from '../__helpers__/keyCodes'

export const skipQuestions = async (
  numOfSkips: number,
  io: MockSTDIN,
  skipWithNo?: boolean,
) => {
  for (
    let i = 0;
    i < (numOfSkips === -1 ? questions.length : numOfSkips);
    i++
  ) {
    await delay(10)
    if (skipWithNo) {
      io.send('No')
    }
    io.send(keys.enter)
  }
}
