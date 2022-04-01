import { execSync, spawnSync } from 'child_process'
import chalk from 'chalk'
import fs from 'fs'
import path from 'path'
import { runBlockingCommand } from './utils/getRunBlockingCommand'
import { promptQuestions } from './utils/inquirer/promptQuestions'
import { replacePlaceholders } from './utils/replacePlaceholders'
import { yarnWorkspaceJSON } from './config/yarn-workspace'
import { pnpmWorkspaceYML } from './config/pnpm-workspace'
import { huskyCommitMsgHook } from './config/husky-commit-msg-hook'
import { CLIs } from './tinyClis'
import { getInstallCommand } from './utils/getInstallCommands'
import { transformScopedName } from './utils/transformScopedName'
import { getPkgManagerLockFile } from './utils/getPkgManagerLockFile'
import { getRunWithFrozenLockCMD } from './utils/runWithFrozenLockCMD'

export const main = async () => {
  const answers = await promptQuestions()

  const pkgName = answers.generatorName
  const dirName = transformScopedName(pkgName)

  // Reused variables
  const projectWorkdir = path.join(process.cwd(), dirName)
  const pkgManager = answers.packageManager
  const usingWorkspaces = answers.usageTemplate
  const workingDir = `cd ${dirName}`
  const generatorLocation = usingWorkspaces
    ? `${workingDir}/packages/generator`
    : workingDir

  // Validate if folder with the same name doesn't exist
  if (fs.existsSync(projectWorkdir)) {
    console.log(chalk.red(`${dirName} directory already exists!`))
    return
  }

  console.log(
    '\nCreating a new Prisma generator in',
    chalk.cyan(path.join(projectWorkdir)) + '.\n',
  )

  // Initialize git
  //! This needs to be at the top cause `husky` won't run
  //! if there was no repository
  fs.mkdirSync(projectWorkdir, { recursive: true })
  execSync(`${workingDir} && git init`)
  console.log(chalk.cyan('\nInitialized a git repository.\n'))

  // Adding default root configs
  const templateName = 'root default configs'
  runBlockingCommand(templateName, CLIs.rootConfigs(dirName))

  if (answers.usageTemplate) {
    const templateName = 'Usage Template'
    runBlockingCommand(templateName, CLIs.usageTemplate(`${dirName}/packages`))
  }

  if (answers.typescript) {
    const templateName = 'Typescript Template'
    const outputLocation = usingWorkspaces
      ? `${dirName}/packages/generator`
      : dirName
    runBlockingCommand(templateName, CLIs.typescriptTemplate(outputLocation))
  }

  // AKA: Javascript
  if (!answers.typescript) {
    const templateName = 'Javascript Template'
    const outputLocation = usingWorkspaces
      ? `${dirName}/packages/generator`
      : dirName

    runBlockingCommand(templateName, CLIs.javascriptTemplate(outputLocation))
  }

  if (answers.githubActions) {
    const templateName = 'Github actions Template'
    runBlockingCommand(templateName, CLIs.githubActionsTemplate(dirName))

    // Replace placeholders
    const workflowPath = path.join(projectWorkdir, '.github/workflows/CI.yml')

    let pkgManagerLockFile = getPkgManagerLockFile(pkgManager)
    let runWithFrozenLockCMD = getRunWithFrozenLockCMD(pkgManager)
    let runCMD = `${pkgManager} run`

    fs.writeFileSync(
      workflowPath,
      fs
        .readFileSync(workflowPath, 'utf-8')
        .replace(
          /\$WORKING_DIR/g,
          usingWorkspaces ? './packages/generator' : '.',
        )
        .replace(
          /\$SETUP_PNPM/,
          pkgManager == 'pnpm'
            ? `- name: Setup PNPM
        uses: pnpm/action-setup@v2.0.1
        with:
          version: 6.23.6`
            : '',
        )
        .replace(/\$PKG_MANAGER_LOCK/g, pkgManagerLockFile)
        .replace(/\$INSTALL_CMD_WITH_FROZEN_LOCK/g, runWithFrozenLockCMD)
        .replace(/\$PKG_MANAGER_RUN_CMD/g, runCMD),
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
  replacePlaceholders(answers, dirName)

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

    console.log(chalk.cyan(`${pkgManager} Workspace`), 'configured correctly\n')
  }

  //! Should be after initializing the workspace
  //! to prevent overwritting the package.json
  //! at the root and merge it instead
  if (answers.semanticRelease) {
    const templateName = 'Automatic Semantic Release'
    const workspaceFlag = usingWorkspaces ? 'workspace' : ''
    runBlockingCommand(
      templateName,
      CLIs.setupSemanticRelease(dirName, workspaceFlag),
      'Configuring',
    )
  }

  console.log(chalk.cyan(`Installing dependencies using ${pkgManager}\n`))

  // Install packages
  spawnSync(getInstallCommand(pkgManager), {
    shell: true,
    stdio: 'inherit',
    cwd: projectWorkdir,
  })

  //! Post-install

  // Build the generator package to start
  // testing the generator output
  const buildCommand = `${pkgManager === 'npm' ? 'npm run' : pkgManager} build`
  runBlockingCommand(
    'Generator',
    `${generatorLocation} && ${buildCommand}`,
    'Building',
  )

  // Switch to 'main' and Commit files
  execSync(
    `${workingDir} && git checkout -b main && git add . && git commit -m"init"`,
  )
  console.log(chalk.cyan('Created git commit.\n'))

  // Add commit-msg husky hook to lint commits
  // using commitlint before they are created
  //! must be added after initilizing a git repo
  //! and after commiting `init` to skip validation
  if (answers.semanticRelease) {
    fs.mkdirSync(path.join(projectWorkdir, './.husky'), {
      recursive: true,
    })
    fs.writeFileSync(
      path.join(projectWorkdir, './.husky/commit-msg'),
      huskyCommitMsgHook,
    )
    execSync(
      `${workingDir} && git add . && git commit -m"feat: added husky for safety commit-msg"`,
    )
  }

  // Success Messages
  console.log(chalk.green(`Success!`), `Created ${projectWorkdir}`)
  console.log(`We suggest that you begin by typing:\n`)
  console.log(chalk.cyan('cd'), dirName)
  console.log(chalk.cyan('code .'))
  console.log(`\nStart Generating ;)`)

  // return answers cause It's useful for tests
  // to verify the behavior based on the answers
  return answers
}
main()
