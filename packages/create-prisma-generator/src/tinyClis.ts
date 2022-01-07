// No need to attach @latest at the end of the package name cause
// npx will always execute the latest available version in the NPM registry
export const CLIs = {
  typescriptTemplate(path: string) {
    return `npx @cpg-cli/template-typescript ${path}`
  },
  rootConfigs(path: string) {
    return `npx @cpg-cli/root-configs ${path}`
  },
  usageTemplate(path: string) {
    return `npx @cpg-cli/template-gen-usage ${path}`
  },
  javascriptTemplate(path: string) {
    return `npx @cpg-cli/template ${path}`
  },
  githubActionsTemplate(path: string) {
    return `npx @cpg-cli/github-actions ${path}`
  },
  setupSemanticRelease(path: string, workspaceFlag: string) {
    return `npx @cpg-cli/semantic-releases ${path} ${workspaceFlag}`
  },
}
