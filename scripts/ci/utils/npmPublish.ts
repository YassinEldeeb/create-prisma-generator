import { execSync } from 'child_process'
import { logger } from 'scripts/utils/logger'

export const npmPublish = (cwd: string) => {
  execSync(`npm publish --no-git-tag-version`, { cwd })
  logger.success('Published the package successfully!')
}
