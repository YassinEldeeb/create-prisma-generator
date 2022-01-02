import fs from 'fs'
import { Volume } from 'memfs'

type fs = typeof fs
type Volume = typeof Volume
export interface MockedFS extends Volume {
  actual: fs
  InitialFSJSONSetup: any
  reset: () => void
  toJSON: () => any
  goBackToInitialSetup: () => any
}
