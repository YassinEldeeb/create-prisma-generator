export const CLIs = {
  typescriptTemplate(path: string) {
    return `npx @cpg-cli/template-typescript@latest ${path}`
  },
  rootConfigs(path: string) {
    return `npx @cpg-cli/root-configs@latest ${path}`
  },
  usageTemplate(path: string) {
    return `npx @cpg-cli/template-gen-usage@latest ${path}`
  },
  javascriptTemplate(path: string) {
    return `npx @cpg-cli/template@latest ${path}`
  },
  githubActionsTemplate(path: string) {
    return `npx @cpg-cli/github-actions@latest ${path}`
  },
  setupSemanticRelease(path: string, workspaceFlag: string) {
    return `npx @cpg-cli/semantic-releases@latest ${path} ${workspaceFlag}`
  },
}
