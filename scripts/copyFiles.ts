import fse from 'fs-extra'
import path from 'path'
import rimraf from 'rimraf'

console.time('Copied Templates in')
console.log(path.join(process.cwd(), process.argv[3]))
rimraf(path.join(process.cwd(), process.argv[3]), (err) => {
  if (err) {
    return console.log("Couldn't delete this directory", err)
  }

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
})
