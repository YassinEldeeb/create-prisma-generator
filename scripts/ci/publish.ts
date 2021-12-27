// Sources:
// https://github.com/semrel-extra/zx-semrel/blob/master/release.mjs
// https://github.com/MarceloPrado/has-changed-path/blob/master/src/hasChanged.js
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const { GIT_COMMITTER_NAME, GIT_COMMITTER_EMAIL, GITHUB_TOKEN } = process.env
if (!GITHUB_TOKEN || !GIT_COMMITTER_NAME || !GIT_COMMITTER_EMAIL) {
  throw new Error(
    'env.GITHUB_TOKEN, env.GIT_COMMITTER_NAME & env.GIT_COMMITTER_EMAIL must be set',
  )
}

// Git configuration
const gitAuth = `${GIT_COMMITTER_NAME}:${GITHUB_TOKEN}`
const originUrl = execSync(`git config --get remote.origin.url`)
  .toString()
  .trim()

const [_, __, repoHost, repoName] = originUrl
  .replace(':', '/')
  .replace(/\.git/, '')
  .match(/.+(@|\/\/)([^/]+)\/(.+)$/) as RegExpMatchArray

const repoPublicUrl = `https://${repoHost}/${repoName}`
const repoAuthedUrl = `https://${gitAuth}@${repoHost}/${repoName}`

// execSync(`git config user.name ${GIT_COMMITTER_NAME}`)
// execSync(`git config user.email ${GIT_COMMITTER_EMAIL}`)
// execSync(`git remote set-url origin ${repoAuthedUrl}`)

// Commits analysis
const releaseSeverityOrder = ['major', 'minor', 'patch']
const semanticRules = [
  { group: 'Features', releaseType: 'minor', prefixes: ['feat'] },
  {
    group: 'Fixes & improvements',
    releaseType: 'patch',
    prefixes: ['fix', 'perf', 'refactor', 'docs'],
  },
  {
    group: 'BREAKING CHANGES',
    releaseType: 'major',
    keywords: ['BREAKING CHANGE', 'BREAKING CHANGES'],
  },
]

const packagesPath = path.join(process.cwd(), 'packages')

fs.readdirSync(packagesPath, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => {
    const pkgJSONPath = path.join(packagesPath, dirent.name, 'package.json')
    if (fs.existsSync(pkgJSONPath)) {
      const pkgJSON = JSON.parse(fs.readFileSync(pkgJSONPath, 'utf-8'))
      const pkgName = pkgJSON.name
      const releasePrefix = pkgName + '-v'

      if (!pkgJSON.private) {
        // Get prev release tag
        const tags = execSync(`git tag -l --sort=-v:refname`)
          .toString()
          .split('\n')
          .map((tag) => tag.trim())

        const lastTag = tags.find((tag) => tag.includes(releasePrefix))
        const commitsRange = lastTag
          ? `${execSync(`git rev-list -1 ${lastTag}`).toString().trim()}..HEAD`
          : 'HEAD'

        const newCommits = execSync(
          `git log --format=+++%s__%b__%h__%H ${commitsRange}`,
        )
          .toString()
          .split('+++')
          .filter(Boolean)
          .map((msg) => {
            const [subj, body, short, hash] = msg
              .split('__')
              .map((raw) => raw.trim())
            return { subj, body, short, hash }
          })

        const semanticChanges = newCommits.reduce(
          (acc: any[], { subj, body, short, hash }) => {
            semanticRules.forEach(
              ({ group, releaseType, prefixes, keywords }) => {
                const prefixMatcher =
                  prefixes &&
                  new RegExp(`^(${prefixes.join('|')})(\\(\\w+\\))?:\\s.+$`)

                const keywordsMatcher =
                  keywords && new RegExp(`(${keywords.join('|')}):\\s(.+)`)

                const change =
                  subj.match(prefixMatcher!)?.[0] ||
                  body.match(keywordsMatcher!)?.[2]

                if (change) {
                  acc.push({
                    group,
                    releaseType,
                    change,
                    subj,
                    body,
                    short,
                    hash,
                  })
                }
              },
            )
            return acc
          },
          [],
        )

        //
        const nextReleaseType = releaseSeverityOrder.find((type) =>
          semanticChanges.find(({ releaseType }) => type === releaseType),
        )
        if (!nextReleaseType) {
          console.log('No semantic changes - no semantic release.')
          return
        }
        const getNextVersion = () => {
          if (!nextReleaseType) {
            return
          }
          if (!lastTag) {
            return '1.0.0'
          }

          const [c1, c2, c3] = lastTag.split(releasePrefix)[1].split('.')
          if (nextReleaseType === 'major') {
            return `${-~c1}.0.0`
          }
          if (nextReleaseType === 'minor') {
            return `${c1}.${-~c2}.0`
          }
          if (nextReleaseType === 'patch') {
            return `${c1}.${c2}.${-~c3}`
          }
        }

        console.log(pkgName, getNextVersion())
        console.log(
          execSync(`git diff --name-only --exit-code packages/${dirent.name}`)
            .toString()
            .trim(),
        )
        //
      }
    }
  })
