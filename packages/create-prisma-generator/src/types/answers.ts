export interface Answers {
  generatorName: string
  typescript: boolean
  packageManager: 'yarn' | 'npm' | 'pnpm'
  githubActions: boolean
  semanticRelease: boolean
  usageTemplate: boolean
}
