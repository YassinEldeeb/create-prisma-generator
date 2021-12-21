import { execSync, spawn } from 'child_process'
import colors from 'colors'
import fs from 'fs'
import path from 'path'
import { runCommand } from './utils/runCommand'
import { promptQuestions } from './utils/promptQuestions'
import { replacePlaceholders } from './utils/replacePlaceholders'
import { yarnWorkspaceJSON } from './config/yarn-workspace'
import { pnpmWorkspaceYML } from './config/pnpm-workspace'

export const main = async () => {
  const answers = await promptQuestions()

  const pkgName = answers.generatorName.toLowerCase()

  if (fs.existsSync(path.join(process.cwd(), pkgName))) {
    console.log(colors.red(`${pkgName} directory already exists!`))
    return
  }
  // Identify a Workspace
  const usingWorkspaces = answers.usageTemplate

  if (answers.usageTemplate) {
    const templateName = 'Usage Template'
    const command = `npx @cpg-cli/template-gen-usage@latest ${pkgName}/packages`
    runCommand(templateName, command)
  }

  if (answers.typescript) {
    const templateName = 'Typescript Template'
    const outputLocation = usingWorkspaces
      ? `${pkgName}/packages/generator`
      : pkgName
    const command = `npx @cpg-cli/template-typescript@latest ${outputLocation}`
    runCommand(templateName, command)
  }

  if (answers.githubAction) {
    const templateName = 'Github actions Template'
    const command = `npx @cpg-cli/github-actions@latest ${pkgName}`
    runCommand(templateName, command)
  }

  replacePlaceholders(answers, pkgName)

  // Setup Workspaces based on pkg manager
  if (usingWorkspaces) {
    if (answers.packageManager === 'yarn') {
      fs.writeFileSync(
        path.join(process.cwd(), pkgName, 'package.json'),
        yarnWorkspaceJSON,
      )
    } else if (answers.packageManager === 'pnpm') {
      fs.writeFileSync(
        path.join(process.cwd(), pkgName, 'pnpm-workspace.yaml'),
        pnpmWorkspaceYML,
      )
    }

    // Simulating a dist folder
    // to make pnpm happy
    fs.mkdirSync(path.join(process.cwd(), pkgName, 'packages/generator/dist'))
    fs.writeFileSync(
      path.join(process.cwd(), pkgName, 'packages/generator/dist/bin.js'),
      '',
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

  // Install packages
  const workingDir = `cd ${pkgName}`

  spawn(`${workingDir} && ${installCommand}`, {
    shell: true,
    stdio: 'inherit',
  }).on('exit', () => {
    const generatorLocation = usingWorkspaces
      ? `${workingDir}/packages/generator`
      : pkgName
    runCommand(
      'Generator',
      `${generatorLocation} && ${answers.packageManager} build`,
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
