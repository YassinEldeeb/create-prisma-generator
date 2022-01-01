import { CLIs } from '../../tinyClis'

type CLIs = typeof CLIs
export const serializeCLIs = (tinyCLIs: CLIs) => {
  return Object.keys(tinyCLIs).map((key) => {
    return { key, command: tinyCLIs[key as keyof CLIs]('path', 'workspace') }
  })
}
