import inquirer from 'inquirer'
import fse from 'fs-extra'
import fs from 'fs'
import path from 'path'
import { spawn, execSync } from 'child_process'
import colors from 'colors'

const main = async () => {
  const answers = (await inquirer.prompt([
    {
      type: 'input',
      name: 'generatorName',
      message: "What's your generator name",
    },
    {
      type: 'confirm',
      name: 'typescript',
      message: 'Do you want to use Typescript',
    },
    {
      type: 'list',
      name: 'packageManager',
      message: 'Which package manager do you want to use',
      choices: ['npm', 'yarn', 'pnpm'],
      default: false,
    },
    {
      type: 'confirm',
      name: 'githubAction',
      message: 'Using github? Can I automate some stuff for you',
    },
  ])) as {
    generatorName: string
    typescript: boolean
    packageManager: 'yarn' | 'npm' | 'pnpm'
    githubAction: true
  }

  const pkgName = answers.generatorName.toLowerCase()

  // if (fs.existsSync(path.join(process.cwd(), pkgName))) {
  //   console.log(colors.red(`${pkgName} directory already exists!`))
  //   return
  // }

  if (answers.typescript && answers.packageManager === 'yarn') {
    fse.copySync(
      path.join(__dirname, './templates/typescript/yarn'),
      path.join(process.cwd(), pkgName),
      {
        filter: (src, dest) => {
          return (
            !src.includes('node_modules') &&
            !src.includes('yalc') &&
            !src.includes('yarn.lock')
          )
        },
      },
    )
  }

  if (answers.githubAction) {
    fse.copySync(
      path.join(__dirname, './templates/common/.github'),
      path.join(process.cwd(), `./${pkgName}/.github`),
    )
  }

  const filesContainingPkgName = [
    './README.md',
    './packages/generator/package.json',
    './packages/generator/README.md',
    './packages/generator/src/constants.ts',
    './packages/usage/prisma/schema.prisma',
  ]

  filesContainingPkgName.forEach((filePath) => {
    const fullPath = path.join(process.cwd(), pkgName, filePath)
    const file = fs.readFileSync(fullPath, { encoding: 'utf-8' })

    fs.writeFileSync(
      fullPath,
      file.replace(/\$PACKAGE_NAME/g, pkgName.toLowerCase()),
    )
  })

  // Install packages
  let installCommand = ''
  switch (answers.packageManager) {
    case 'npm':
      installCommand = 'npm i'
      break
    case 'yarn':
      installCommand = 'yarn'
      break
    case 'pnpm':
      installCommand = 'pnpm i'
      break
  }

  const workingDir = `cd ${pkgName}`

  spawn(`${workingDir} && ${installCommand}`, {
    shell: true,
    stdio: 'inherit',
  }).on('exit', () => {
    console.log(colors.green(`Your boilerplate is ready!`))
    console.log(`Start hacking 😉`)
    console.log(workingDir)
    console.log('code .')
  })

  // Initialize git
  execSync(`${workingDir} && git init && git add . && git commit -m"init"`)
}
main()
