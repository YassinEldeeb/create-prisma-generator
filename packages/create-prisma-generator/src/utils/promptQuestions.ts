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
      type: 'list',
      name: 'setupCI',
      message: 'Automate publishing the generator with which CI',
      choices: ['None, Thank you', 'Github Actions', 'Circle CI', 'Travis CI'],
      default: 'None, Thank you',
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
