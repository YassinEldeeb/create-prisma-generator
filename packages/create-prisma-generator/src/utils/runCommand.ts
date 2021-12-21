import { execSync } from 'child_process'
import colors from 'colors'
import { loading } from './loading'

export const runCommand = (
  name: string,
  command: string,
  type: 'Loading' | 'Building' = 'Loading',
) => {
  console.log(colors.cyan(`${type} ${name}...`))
  const clearAnimation = loading()
  execSync(command)
  clearAnimation()
  console.log(
    colors.green(
      `${name} ${type === 'Loading' ? 'Loaded' : 'Built'} Successfully!`,
    ),
  )
}
