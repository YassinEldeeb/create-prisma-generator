import { execSync, spawn } from 'child_process'
import colors from 'colors'
import fs from 'fs'
import path from 'path'
import { runCommand } from './utils/runCommand'
import { promptQuestions } from './utils/promptQuestions'
import { replacePlaceholders } from './utils/replacePlaceholders'

export const main = async () => {
  const answers = await promptQuestions()

  const pkgName = answers.generatorName.toLowerCase()

  if (fs.existsSync(path.join(process.cwd(), pkgName))) {
    console.log(colors.red(`${pkgName} directory already exists!`))
    return
  }

  if (answers.typescript) {
    const templateName = 'Typescript Template'
    const command = `npx @cpg-cli/template-typescript@latest ${pkgName}`
    runCommand(templateName, command)
  }

  if (answers.githubAction) {
    const templateName = 'Github action Template'
    const command = `npx @cpg-cli/github-actions@latest ${pkgName}`
    runCommand(templateName, command)
  }

  replacePlaceholders(answers, pkgName)

  if (answers.packageManager === 'yarn') {
    const yarnWorkspaceJSON = {
      private: true,
      workspaces: ['packages/*'],
    }
    fs.writeFileSync(
      path.join(process.cwd(), pkgName, 'package.json'),
      JSON.stringify(yarnWorkspaceJSON, null, 2),
    )
  } else if (answers.packageManager === 'pnpm') {
    const pnpmWorkspaceYML = `packages:
  # all packages in subdirs of packages/
  - 'packages/**'
  # exclude packages that are inside test directories
  - '!**/test/**'`

    fs.writeFileSync(
      path.join(process.cwd(), pkgName, 'pnpm-workspace.yaml'),
      pnpmWorkspaceYML,
    )
  }

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

  // Simulating a dist folder
  // to make pnpm happy
  fs.mkdirSync(path.join(process.cwd(), pkgName, 'packages/generator/dist'))
  fs.writeFileSync(
    path.join(process.cwd(), pkgName, 'packages/generator/dist/bin.js'),
    '',
  )

  // Install packages
  const workingDir = `cd ${pkgName}`

  spawn(`${workingDir} && ${installCommand}`, {
    shell: true,
    stdio: 'inherit',
  }).on('exit', () => {
    runCommand(
      'Generator',
      `${workingDir}/packages/generator && ${answers.packageManager} build`,
      'Building',
    )
    console.log(colors.green(`Your boilerplate is ready!`))
    console.log(`Start hacking 😉`)
    console.log(workingDir)
    console.log('code .')
  })

  // Initialize git
  execSync(`${workingDir} && git init && git add . && git commit -m"init"`)
}
main()
