export interface Answers {
  generatorName: string
  typescript: boolean
  packageManager: 'yarn' | 'npm' | 'pnpm'
  githubAction: boolean
  usageTemplate: boolean
}
