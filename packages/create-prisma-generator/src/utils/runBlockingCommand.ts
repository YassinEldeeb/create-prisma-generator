import { execSync } from 'child_process'
import colors from 'colors'

export const runBlockingCommand = (
  name: string,
  command: string,
  type: 'Loading' | 'Building' | 'Configuring' = 'Loading',
) => {
  console.log(colors.cyan(`${type} ${name}...`))
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
  console.log(colors.green(`${name} ${successMsg} Successfully!\n`))
}
