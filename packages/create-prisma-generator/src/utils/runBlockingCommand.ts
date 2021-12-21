import { execSync } from 'child_process'
import colors from 'colors'

export const runBlockingCommand = (
  name: string,
  command: string,
  type: 'Loading' | 'Building' = 'Loading',
) => {
  console.log(colors.cyan(`${type} ${name}...`))
  execSync(command)
  console.log(
    colors.green(
      `${name} ${type === 'Loading' ? 'Loaded' : 'Built'} Successfully!\n`,
    ),
  )
}
