import fs from 'fs'
import path from 'path'
import { exec, execSync } from 'child_process'

const packagesPath = path.join(process.cwd(), 'packages')

const packages = fs
  .readdirSync(packagesPath, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())

packages.forEach((pkg) => {
  const packageJSON = JSON.parse(
    fs.readFileSync(path.join(packagesPath, pkg.name, 'package.json'), 'utf-8'),
  )

  if (!packageJSON.private) {
    exec(
      `npm view ${packageJSON.name} version`,
      function (error, stdout, stderr) {
        const pkgVersion = stdout.trim()
        execSync(`git tag ${packageJSON.name}-v${pkgVersion}`)
      },
    )
  }
})

execSync('git push --follow-tags origin main')
