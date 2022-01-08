import { CLIs } from '../../tinyClis'

export const serializeCLI = (key: keyof typeof CLIs) => {
  return CLIs[key]('path', 'workspace')
}
