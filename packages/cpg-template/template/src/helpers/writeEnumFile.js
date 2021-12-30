import path from 'path'
import { writeFileSafely } from '../utils/writeFileSafely'

export const writeEnumFile = async (
  enumName,
  tsEnum,
  outputPath,
) => {
  const writeLocation = path.join(outputPath, `${enumName}.ts`)
  await writeFileSafely(writeLocation, tsEnum)
}
