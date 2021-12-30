import { execSync } from 'child_process'
import { logger } from '../../utils/logger'

export const npmPublish = (cwd: string) => {
  execSync(`npm publish --no-git-tag-version`, { cwd })

  console.log('\n')
  logger.success('Published the package successfully!')
  console.log('\n')
}
