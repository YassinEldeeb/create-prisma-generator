#!/usr/bin/env node
import path from 'path'
import fse from 'fs-extra'
import YAML from 'yaml'

// Modify CI.yml Publish workflow
// To use semantic release
const pkgName = process.argv[2]
const usingWorkspaces = process.argv[3]
const workingDir = path.join(process.cwd(), pkgName)
const CIPath = path.join(workingDir, '.github/workflows/CI.yml')

const CIYMLFile = fse.readFileSync(CIPath, 'utf8')
const parsedCI = YAML.parse(CIYMLFile)

const modifiedSteps = parsedCI.jobs.Publish.steps.map((e) => {
  if (e.name?.includes('Publish')) {
    return {
      ...e,
      run: 'npx semantic-release',
      env: { ...e.env, GITHUB_TOKEN: '${{ secrets.GH_TOKEN }}' },
    }
  } else {
    return e
  }
})

parsedCI.jobs.Publish.steps = modifiedSteps

fse.writeFileSync(CIPath, YAML.stringify(parsedCI, { singleQuote: true }))

// Add needed dependencies for
// semantic release
let PKGJSONPath
if (usingWorkspaces) {
  PKGJSONPath = path.join(workingDir, './packages/generator/package.json')
} else {
  PKGJSONPath = path.join(workingDir, './package.json')
}

const PkgJSONFile = JSON.parse(fse.readFileSync(PKGJSONPath, 'utf8'))
const semanticReleaseDeps = {
  '@semantic-release/changelog': '^6.0.1',
  '@semantic-release/git': '^10.0.1',
  'semantic-release': '^18.0.1',
}

for (const dependency in semanticReleaseDeps) {
  PkgJSONFile.devDependencies[dependency] = semanticReleaseDeps[dependency]
}

// Config semantic release
const releaseConfig = {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'CHANGELOG.md',
      },
    ],
    '@semantic-release/npm',
    '@semantic-release/github',
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md', 'package.json'],
        message:
          'chore(release): set `package.json` to ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
  ],
}

PkgJSONFile.release = releaseConfig

fse.writeFileSync(PKGJSONPath, JSON.stringify(PkgJSONFile, null, 2))
