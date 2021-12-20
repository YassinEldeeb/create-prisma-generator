import path from 'path'
import fse from 'fs-extra'

export const copyTemplate = (copyFrom: string, copyTo: string) => {
  fse.copySync(path.join(copyFrom), path.join(process.cwd(), copyTo))
}
