export interface Answers {
  generatorName: string
  typescript: boolean
  packageManager: 'yarn' | 'npm' | 'pnpm'
  setupCI: 'None, Thank you' | 'Github Actions' | 'Circle CI' | 'Travis CI'
  usageTemplate: boolean
}
