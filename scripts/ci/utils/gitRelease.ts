import { execSync } from 'child_process'
import { logger } from '../../utils/logger'

export const gitRelease = () => {
  const releaseMessage = `chore(release): Update package.json(s) versions [skip ci]`
  execSync(`git commit --no-verify -m"${releaseMessage}"`)
  execSync(`git push --no-verify --follow-tags origin main`)

  logger.success('Pushed the updated package.json(s) and the new tags!')
}
