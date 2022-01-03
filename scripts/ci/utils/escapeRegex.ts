export const escapeRegex = (content: string) => {
  return content.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
