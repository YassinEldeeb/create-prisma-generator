import { execSync, spawn } from 'child_process'
import colors from 'colors'
import fs from 'fs'
import path from 'path'
import { runBlockingCommand } from './utils/runBlockingCommand'
import { promptQuestions } from './utils/promptQuestions'
import { replacePlaceholders } from './utils/replacePlaceholders'
import { yarnWorkspaceJSON } from './config/yarn-workspace'
import { pnpmWorkspaceYML } from './config/pnpm-workspace'
import validatePkgName from 'validate-npm-package-name'

export const main = async () => {
  const answers = await promptQuestions()

  const pkgName = answers.generatorName.toLowerCase()

  // Validate Package Name
  const validPkgName = validatePkgName(pkgName)
  if (!validPkgName.validForNewPackages) {
    console.log(colors.red(`"${pkgName}" isn't a valid package name!`))
    validPkgName.errors?.forEach((e) => console.log(colors.cyan(e)))
    return
  }
  const projectWorkdir = path.join(process.cwd(), pkgName)

  // Validate if folder with the same name doesn't exist
  if (fs.existsSync(path.join(projectWorkdir))) {
    console.log(colors.red(`${pkgName} directory already exists!`))
    return
  }

  console.log(
    '\nCreating a new Prisma generator in',
    colors.cyan(path.join(projectWorkdir)) + '.\n',
  )

  // Adding default root configs
  const templateName = 'root default configs'
  const command = `npx @cpg-cli/root-configs@latest ${pkgName}`
  runBlockingCommand(templateName, command)

  // Identify a Workspace
  const usingWorkspaces = answers.usageTemplate

  if (answers.usageTemplate) {
    const templateName = 'Usage Template'
    const command = `npx @cpg-cli/template-gen-usage@latest ${pkgName}/packages`
    runBlockingCommand(templateName, command)
  }

  if (answers.typescript) {
    const templateName = 'Typescript Template'
    const outputLocation = usingWorkspaces
      ? `${pkgName}/packages/generator`
      : pkgName
    const command = `npx @cpg-cli/template-typescript@latest ${outputLocation}`
    runBlockingCommand(templateName, command)
  }

  if (!answers.typescript) {
    const templateName = 'Javascript Template'
    const outputLocation = usingWorkspaces
      ? `${pkgName}/packages/generator`
      : pkgName
    const command = `npx @cpg-cli/template@latest ${outputLocation}`
    runBlockingCommand(templateName, command)
  }

  if (answers.githubAction) {
    const templateName = 'Github actions Template'
    const command = `npx @cpg-cli/github-actions@latest ${pkgName}`
    runBlockingCommand(templateName, command)
  }

  // Replace placeholders like $PACKAGE_NAME with actual pkgName
  // In places where It's needed
  replacePlaceholders(answers, pkgName)

  // Setup Workspaces based on pkg manager
  if (usingWorkspaces) {
    if (answers.packageManager === 'yarn') {
      fs.writeFileSync(
        path.join(projectWorkdir, 'package.json'),
        yarnWorkspaceJSON,
      )
    } else if (answers.packageManager === 'pnpm') {
      fs.writeFileSync(
        path.join(projectWorkdir, 'pnpm-workspace.yaml'),
        pnpmWorkspaceYML,
      )
    }

    // Simulating a dist folder
    // to make pnpm happy
    fs.mkdirSync(path.join(projectWorkdir, 'packages/generator/dist'))
    fs.writeFileSync(
      path.join(projectWorkdir, 'packages/generator/dist/bin.js'),
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
    // Build the generator package to start
    // testing the generator output
    const generatorLocation = usingWorkspaces
      ? `${workingDir}/packages/generator`
      : workingDir
    runBlockingCommand(
      'Generator',
      `${generatorLocation} && ${answers.packageManager} build`,
      'Building',
    )

    // Initialize git
    execSync(`${workingDir} && git init && git add . && git commit -m"init"`)
    console.log(colors.cyan('\nInitialized a git repository.'))
    console.log(colors.cyan('Created git commit.\n'))

    // Success Messages
    console.log(colors.green(`Success!`), `Created ${projectWorkdir}`)
    console.log('\n')
    console.log(`We suggest that you begin by typing:\n`)
    console.log(colors.cyan('cd'), pkgName)
    console.log(colors.cyan('code .'))
    console.log(`\nStart hacking 😉`)
  })
}
main()
