import inquirer from 'inquirer'
import { Answers } from '../types/answers'

export const promptQuestions = async (): Promise<Answers> => {
  const questions: inquirer.QuestionCollection<any> = [
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
      choices: ['yarn', 'pnpm', 'npm'],
      default: 'pnpm',
    },
    {
      type: 'confirm',
      name: 'githubActions',
      message: 'Automate publishing the generator with Github Actions',
    },
    {
      type: 'confirm',
      name: 'usageTemplate',
      message: 'Setup workspace for testing the generator',
    },
  ]
  const answers = (await inquirer.prompt(questions)) as Answers

  return answers
}
