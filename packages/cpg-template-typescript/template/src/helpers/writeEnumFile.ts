import path from 'path'
import { writeFileSafely } from '../utils/writeFileSafely'

export const writeEnumFile = async (
  enumName: string,
  tsEnum: string,
  outputPath: string,
) => {
  const writeLocation = path.join(outputPath, `${enumName}.ts`)
  await writeFileSafely(writeLocation, tsEnum)
}
