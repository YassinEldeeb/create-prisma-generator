import inquirer from 'inquirer'
import { Answers } from '../types/answers'
import validatePkgName from 'validate-npm-package-name'
import colors from 'colors'

export const questions: inquirer.QuestionCollection<any>[] = [
  {
    type: 'input',
    name: 'generatorName',
    message: "what's your generator name",
    // Validate Package Name
    validate(pkgName) {
      const validPkgName = validatePkgName(pkgName)
      if (!validPkgName.validForNewPackages) {
        console.log(colors.red(`\n"${pkgName}" isn't a valid package name!`))
        validPkgName.errors?.forEach((e) => console.log(colors.cyan(e)))
        validPkgName.warnings?.forEach((e) => console.log(colors.yellow(e)))
        return false
      } else {
        return true
      }
    },
  },
  {
    type: 'confirm',
    name: 'typescript',
    message: 'do you want to use Typescript',
  },
  {
    type: 'list',
    name: 'packageManager',
    message: 'which package manager do you want to use',
    choices: ['yarn', 'pnpm', 'npm'],
    default: 'pnpm',
  },
  {
    type: 'confirm',
    name: 'githubActions',
    message: 'automate publishing the generator with Github Actions',
  },
  {
    type: 'confirm',
    name: 'semanticRelease',
    message: '(Github Actions) setup automatic semantic release',
    when: (answers: Answers) => {
      return answers.githubActions
    },
  },
  {
    type: 'confirm',
    name: 'usageTemplate',
    message: 'setup workspace for testing the generator',
  },
]

export const promptQuestions = async (): Promise<Answers> => {
  const answers = (await inquirer.prompt(questions)) as Answers

  return answers
}
