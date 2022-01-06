import inquirer from 'inquirer'
import { Answers } from '../../types/answers'
import { filterValue } from './filters/value'
import { validateGeneratorName } from './validations/generatorName'

// ANCHOR[id=questions]
export const questions: inquirer.QuestionCollection<any>[] = [
  // ANCHOR[id=Q1-generatorName]
  {
    type: 'input',
    name: 'generatorName',
    message: "what's your generator name",
    // Validate Package Name
    validate(pkgName: string) {
      return validateGeneratorName(pkgName)
    },
  },
  // ANCHOR[id=Q2-usingTypescript]
  {
    type: 'confirm',
    name: 'typescript',
    message: 'do you want to use Typescript',
  },
  // ANCHOR[id=Q3-selectPkgManager]
  {
    type: 'list',
    name: 'packageManager',
    message: 'which package manager do you want to use',
    choices: ['yarn', 'pnpm', 'npm'],
    default: 'pnpm',
  },
  // ANCHOR[id=Q4-usingGithubActions]
  {
    type: 'confirm',
    name: 'githubActions',
    message: 'automate publishing the generator with Github Actions',
  },
  // ANCHOR[id=Q5-enableSemanticRelease]
  {
    type: 'confirm',
    name: 'semanticRelease',
    message: '(Github Actions) setup automatic semantic release',
    when: (answers: Answers) => {
      return answers.githubActions
    },
  },
  // ANCHOR[id=Q5-setupWorkspaceWithUsage]
  {
    type: 'confirm',
    name: 'usageTemplate',
    message: 'setup workspace for testing the generator',
  },
]

export const promptQuestions = async (): Promise<Answers> => {
  const answers = (await inquirer.prompt(questions)) as Answers

  Object.keys(answers).forEach((e) => {
    const value = answers[e as keyof typeof answers]
    ;(answers as any)[e] = filterValue(value)
  })

  return answers
}
