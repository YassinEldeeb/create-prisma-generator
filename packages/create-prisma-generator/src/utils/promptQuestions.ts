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
      choices: ['npm', 'yarn', 'pnpm'],
      default: false,
    },
    {
      type: 'confirm',
      name: 'githubAction',
      message: 'Using github? Can I automate some stuff for you',
    },
  ]
  const answers = (await inquirer.prompt(questions)) as Answers

  return answers
}
