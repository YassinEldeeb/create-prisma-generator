const path = require('path')
const fs = require('fs')

const setup = () => {
  function copySync(from, to) {
    fs.mkdirSync(to, { recursive: true })
    fs.readdirSync(from).forEach((element) => {
      if (fs.lstatSync(path.join(from, element)).isFile()) {
        fs.copyFileSync(path.join(from, element), path.join(to, element))
      } else {
        copySync(path.join(from, element), path.join(to, element))
      }
    })
  }
  copySync(
    path.join(__dirname, `./template`),
    path.join(process.cwd(), process.argv[2]),
  )

  fs.renameSync(
    path.join(process.cwd(), process.argv[2], 'gitIgnoreConf.txt'),
    path.join(process.cwd(), process.argv[2], '.gitignore'),
  )
}

module.exports = setup
