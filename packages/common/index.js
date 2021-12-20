import path from 'path'
import fse from 'fs-extra'

const copyTemplate = (copyFrom, copyTo) => {
  fse.copySync(path.join(copyFrom), path.join(process.cwd(), copyTo))
}

export { copyTemplate }
