const path = require('path')
const fs = require('fs')
const YAML = require('yaml')

const setup = () => {
  // Modify CI.yml Publish workflow
  // To use semantic release
  const pkgName = process.argv[2]
  const usingWorkspaces = process.argv[3]
  const workingDir = path.join(process.cwd(), pkgName)
  const CIPath = path.join(workingDir, '.github/workflows/CI.yml')

  const CIYMLFile = fs.readFileSync(CIPath, 'utf8')
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

  fs.writeFileSync(CIPath, YAML.stringify(parsedCI, { singleQuote: true }))

  // Add needed dependencies for
  // semantic release
  let PKGJSONPath
  if (usingWorkspaces) {
    PKGJSONPath = path.join(workingDir, './packages/generator/package.json')
  } else {
    PKGJSONPath = path.join(workingDir, './package.json')
  }

  const PkgJSONFile = JSON.parse(fs.readFileSync(PKGJSONPath, 'utf8'))
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
  fs.writeFileSync(PKGJSONPath, JSON.stringify(PkgJSONFile, null, 2))

  // Copy template configs
  fs.copyFileSync(
    path.join(path.join(__dirname, `./template/commitlint.config.js`)),
    path.join(workingDir, 'commitlint.config.js'),
  )
  const rootPkgJSONPath = path.join(workingDir, 'package.json')
  const templatePkgJSON = fs.readFileSync(
    path.join(__dirname, `./template/package.json`),
    'utf-8',
  )

  if (!fs.existsSync(rootPkgJSONPath)) {
    fs.writeFileSync(rootPkgJSONPath, templatePkgJSON)
  } else {
    const existingRootPkgJSON = JSON.parse(
      fs.readFileSync(rootPkgJSONPath, 'utf-8'),
    )

    // Merge the two package.json(s)
    fs.writeFileSync(
      rootPkgJSONPath,
      JSON.stringify(
        {
          ...existingRootPkgJSON,
          ...JSON.parse(templatePkgJSON),
        },
        null,
        2,
      ),
    )
  }
}

module.exports = setup
