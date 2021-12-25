import fs from 'fs'
import path from 'path'

const dependabotTemplate = (path: string) => `  - package-ecosystem: 'npm'
    directory: '${path}'
    schedule:
      interval: 'weekly'
`
const packagesPath = path.join(process.cwd(), 'packages')
const packages = fs
  .readdirSync(packagesPath, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())

const dependabotConfig: string[] = []
const dependabotYMLPath = path.join(process.cwd(), '.github/dependabot.yml')
packages.forEach((pkg) => {
  const folders = fs
    .readdirSync(path.join(packagesPath, pkg.name), { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())

  if (
    folders.find((e) => e.name === 'template') &&
    // Check if the template folder contains package.json
    fs.existsSync(path.join(packagesPath, `${pkg.name}/template/package.json`))
  ) {
    dependabotConfig.push(
      dependabotTemplate('/packages/' + pkg.name + '/template'),
    )
  }
})

const placeholder = '# ADDED PROGRAMATICALLY'
const dependabotFile = fs.readFileSync(dependabotYMLPath, 'utf-8')
fs.writeFileSync(
  dependabotYMLPath,
  (dependabotFile.split(placeholder)[0] + placeholder).replace(
    placeholder,
    `${placeholder}\n` + dependabotConfig.join('\n'),
  ),
)
