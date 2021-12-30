import { execSync, spawn } from 'child_process'
import colors from 'colors'
import fs from 'fs'
import path from 'path'
import { runBlockingCommand } from './utils/runBlockingCommand'
import { promptQuestions } from './utils/promptQuestions'
import { replacePlaceholders } from './utils/replacePlaceholders'
import { yarnWorkspaceJSON } from './config/yarn-workspace'
import { pnpmWorkspaceYML } from './config/pnpm-workspace'
import { huskyCommitMsgHook } from './config/husky-commit-msg-hook'
import { CLIs } from './tinyClis'

export const main = async () => {
  const answers = await promptQuestions()

  const pkgName = answers.generatorName.toLowerCase()

  // Reused variables
  const projectWorkdir = path.join(process.cwd(), pkgName)
  const pkgManager = answers.packageManager
  const usingWorkspaces = answers.usageTemplate
  const workingDir = `cd ${pkgName}`
  const generatorLocation = usingWorkspaces
    ? `${workingDir}/packages/generator`
    : workingDir

  // Validate if folder with the same name doesn't exist
  if (fs.existsSync(path.join(projectWorkdir))) {
    console.log(colors.red(`${pkgName} directory already exists!`))
    return
  }

  console.log(
    '\nCreating a new Prisma generator in',
    colors.cyan(path.join(projectWorkdir)) + '.\n',
  )

  // Initialize git
  //! This needs to be at the top cause `husky` won't run
  //! if there was no repository
  fs.mkdirSync(projectWorkdir)
  execSync(`${workingDir} && git init`)
  console.log(colors.cyan('\nInitialized a git repository.\n'))

  // Adding default root configs
  const templateName = 'root default configs'
  runBlockingCommand(templateName, CLIs.rootConfigs(`${pkgName}/packages`))

  if (answers.usageTemplate) {
    const templateName = 'Usage Template'
    runBlockingCommand(templateName, CLIs.usageTemplate(pkgName))
  }

  if (answers.typescript) {
    const templateName = 'Typescript Template'
    const outputLocation = usingWorkspaces
      ? `${pkgName}/packages/generator`
      : pkgName
    runBlockingCommand(templateName, CLIs.typescriptTemplate(outputLocation))
  }

  // AKA: Javascript
  if (!answers.typescript) {
    const templateName = 'Javascript Template'
    const outputLocation = usingWorkspaces
      ? `${pkgName}/packages/generator`
      : pkgName

    runBlockingCommand(templateName, CLIs.javascriptTemplate(outputLocation))
  }

  if (answers.githubActions) {
    const templateName = 'Github actions Template'
    runBlockingCommand(templateName, CLIs.githubActionsTemplate(pkgName))

    // Replace placeholders
    const workflowPath = path.join(projectWorkdir, '.github/workflows/CI.yml')
    fs.writeFileSync(
      workflowPath,
      fs
        .readFileSync(workflowPath, 'utf-8')
        .replace(
          /\$WORKING_DIR/g,
          usingWorkspaces ? './packages/generator' : '.',
        ),
    )
    const dependabotPath = path.join(projectWorkdir, '.github/dependabot.yml')
    fs.writeFileSync(
      dependabotPath,
      fs
        .readFileSync(dependabotPath, 'utf-8')
        .replace(
          /\$GENERATOR_DIR/g,
          usingWorkspaces ? '/packages/generator/' : '/',
        ),
    )
  }

  // Replace placeholders like $PACKAGE_NAME with actual pkgName
  // In places where It's needed
  replacePlaceholders(answers, pkgName)

  // Setup Workspaces based on pkg manager
  if (usingWorkspaces) {
    if (pkgManager === 'yarn' || pkgManager === 'npm') {
      fs.writeFileSync(
        path.join(projectWorkdir, 'package.json'),
        yarnWorkspaceJSON,
      )
    } else if (pkgManager === 'pnpm') {
      fs.writeFileSync(
        path.join(projectWorkdir, 'pnpm-workspace.yaml'),
        pnpmWorkspaceYML,
      )
    }

    // Simulating a dist folder
    // to make pnpm happy :)
    fs.mkdirSync(path.join(projectWorkdir, 'packages/generator/dist'))
    fs.writeFileSync(
      path.join(projectWorkdir, 'packages/generator/dist/bin.js'),
      '',
    )

    console.log(
      colors.cyan(`${pkgManager} Workspace`),
      'configured correctly\n',
    )
  }

  //! Should be after initializing the workspace
  //! to prevent overwritting the package.json
  //! at the root and merge it instead
  if (answers.semanticRelease) {
    const templateName = 'Automatic Semantic Release'
    const workspaceFlag = usingWorkspaces ? 'workspace' : ''
    runBlockingCommand(
      templateName,
      CLIs.setupSemanticRelease(pkgName, workspaceFlag),
      'Configuring',
    )
  }

  let installCommand = ''
  switch (pkgManager) {
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

  console.log(colors.cyan(`Installing dependencies using ${pkgManager}\n`))

  // Install packages
  //? Using spawn and not spawnSync here so that
  //? It's pretty obvious to me where the end
  //? of the setup is
  spawn(installCommand, {
    shell: true,
    stdio: 'inherit',
    cwd: projectWorkdir,
  }).on('exit', () => {
    // Build the generator package to start
    // testing the generator output
    const buildCommand = `${
      pkgManager === 'npm' ? 'npm run' : pkgManager
    } build`
    runBlockingCommand(
      'Generator',
      `${generatorLocation} && ${buildCommand}`,
      'Building',
    )

    // Switch to 'main' and Commit files
    execSync(
      `${workingDir} && git checkout -b main && git add . && git commit -m"init"`,
    )
    console.log(colors.cyan('Created git commit.\n'))

    // Add commit-msg husky hook to lint commits
    // using commitlint before they are created
    //! must be added after initilizing a git repo
    //! and after commiting `init` to skip validation
    if (answers.semanticRelease) {
      fs.writeFileSync(
        path.join(projectWorkdir, './.husky/commit-msg'),
        huskyCommitMsgHook,
      )
      execSync(
        `${workingDir} && git add . && git commit -m"feat: added husky for safety commit-msg"`,
      )
    }

    // Success Messages
    console.log(colors.green(`Success!`), `Created ${projectWorkdir}`)
    console.log(`We suggest that you begin by typing:\n`)
    console.log(colors.cyan('cd'), pkgName)
    console.log(colors.cyan('code .'))
    console.log(`\nStart Generating ;)`)
  })
}
main()
