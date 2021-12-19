import fse from 'fs-extra'
import path from 'path'

console.time('Copied Templates in')
fse.copySync(
  path.join(process.cwd(), process.argv[2]),
  path.join(process.cwd(), process.argv[3]),
  {
    filter: (src, dist) => {
      return !src.includes('node_modules')
    },
  },
)
console.timeEnd('Copied Templates in')
