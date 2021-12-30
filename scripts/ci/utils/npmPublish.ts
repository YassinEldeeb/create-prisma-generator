import { execSync } from 'child_process'

export const npmPublish = (cwd: string) => {
  execSync(
    `NPM_TOKEN=${process.env.NPM_TOKEN} npm publish --no-git-tag-version`,
    { cwd },
  )
  console.log('Published the package successfully!')
}
