export const pnpmWorkspaceYML = `packages:
  # all packages in subdirs of packages/
  - 'packages/**'
  # exclude packages that are inside test directories
  - '!**/test/**'`
