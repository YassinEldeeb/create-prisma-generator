import { MockSTDIN } from 'mock-stdin'
import { keys } from './keyCodes'

export const clearInput = (io: MockSTDIN, inputLength: number) => {
  for (let i = 0; i < inputLength; i++) {
    io.send(keys.delete)
  }
}
