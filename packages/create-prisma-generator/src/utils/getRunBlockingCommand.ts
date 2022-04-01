import { execSync } from 'child_process'
import chalk from 'chalk'

export const runBlockingCommand = (
  name: string,
  command: string,
  type: 'Loading' | 'Building' | 'Configuring' = 'Loading',
) => {
  console.log(chalk.cyan(`${type} ${name}...`))
  execSync(command)

  let successMsg
  switch (type) {
    case 'Loading':
      successMsg = 'Loaded'
      break
    case 'Building':
      successMsg = 'Built'
      break
    case 'Configuring':
      successMsg = 'Configured'
      break
  }
  console.log(chalk.green(`${name} ${successMsg} Successfully!\n`))
}
