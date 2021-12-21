import fs from 'fs'
import path from 'path'
import { formatFile } from './formatFile'

export const writeFileSafely = async (writeLocation, content) => {
  const fileName = writeLocation.split(path.sep).reverse()[0]
  const folders = writeLocation
    .replace(fileName, '')
    .replace(process.cwd(), '')
    .split(path.sep)
    .filter((e) => e.length)

  folders.forEach((_, i) => {
    const folder = folders.slice(0, i + 1).join(path.sep)

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder)
    }
  })

  fs.writeFileSync(writeLocation, await formatFile(content))
}
