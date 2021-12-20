import { execSync, spawn } from 'child_process'
import colors from 'colors'
import fs from 'fs'
import fse from 'fs-extra'
import path from 'path'
import { promptQuestions } from './utils/promptQuestions'

export const main = async () => {
  const answers = await promptQuestions()

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
            !dest.includes('node_modules') &&
            !dest.includes('yalc') &&
            !dest.includes('yarn.lock')
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
    './packages/usage/package.json',
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

  // Install packages
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
