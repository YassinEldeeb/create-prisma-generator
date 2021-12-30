import { writeEnumFile } from '../helpers/writeEnumFile'
import { writeFileSafely } from '../utils/writeFileSafely'

jest.mock('../utils/writeFileSafely')

test('write enum file', async () => {
  await writeEnumFile('Example', '', '')
  expect(writeFileSafely).toHaveBeenCalled()
})
