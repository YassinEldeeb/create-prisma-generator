import { MockSTDIN } from 'mock-stdin'
import { delay } from './delay'
import { keys } from './keyCodes'

export const answer = async (
  io: MockSTDIN,
  options?: { keys?: (keyof typeof keys)[]; text?: string },
) => {
  await delay(10)
  if (options?.keys) {
    options.keys.forEach((e) => io.send(keys[e]))
  } else if (options?.text) {
    io.send(options.text)
  }
  io.send(keys.enter)
}
