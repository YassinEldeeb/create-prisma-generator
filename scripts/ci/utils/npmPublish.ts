import { execSync } from 'child_process'
import { logger } from '../../utils/logger'

export const npmPublish = (cwd: string) => {
  execSync(`npm publish --no-git-tag-version`, { cwd })
  logger.success('\nPublished the package successfully!\n')
}
