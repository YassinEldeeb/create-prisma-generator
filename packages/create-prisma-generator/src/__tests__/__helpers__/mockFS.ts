import memfs from 'memfs'
import fs from 'fs'
import path from 'path'

export const mockFS = () => {
  jest.mock('fs', () => {
    const { Volume } = require('memfs') as typeof memfs
    const fsModule = jest.requireActual(`fs`) as typeof fs
    const pathModule = jest.requireActual(`path`) as typeof path

    const packagesPath = pathModule.join(__dirname, '../../../')
    const packages = fsModule
      .readdirSync(packagesPath, { withFileTypes: true })
      .filter((dirent: any) => dirent.isDirectory())

    const JSONFS = {}
    // Setup in-memory `fs`
    packages.forEach((pkg: fs.Dirent) => {
      if (pkg.name === 'create-prisma-generator') {
        return
      }
      function* walkSync(dir: string): any {
        const files = fsModule.readdirSync(dir, { withFileTypes: true })
        for (const file of files) {
          if (file.isDirectory()) {
            yield* walkSync(pathModule.join(dir, file.name))
          } else {
            yield pathModule.join(dir, file.name)
          }
        }
      }

      for (const filePath of walkSync(
        pathModule.join(packagesPath, pkg.name),
      )) {
        if (!filePath.includes('node_modules')) {
          // @ts-ignore
          JSONFS[filePath] =
            filePath.includes(
              pathModule.join(packagesPath, pkg.name, 'template'),
            ) &&
            !filePath.includes('.yml') &&
            !filePath.includes('package.json')
              ? ''
              : fsModule.readFileSync(filePath, 'utf-8')
        }
      }
    })

    // @ts-ignore
    JSONFS[pathModule.join(packagesPath, 'create-prisma-generator/file.txt')] =
      ''
    const vol = Volume.fromJSON(JSONFS)

    ;(vol as any).actual = fsModule

    return vol
  })
}
