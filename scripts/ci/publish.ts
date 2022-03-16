// Thanks for the nice guide:
// https://dev.to/antongolub/you-don-t-need-semantic-release-sometimes-3k6k
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { AuthGithub } from './utils/authGithub'
import { generateReleaseNotes } from './utils/genReleaseNotes'
import { getNextVersion } from './utils/getNextVersion'
import { githubRelease } from './utils/githubRelease'
import { gitRelease } from './utils/gitRelease'
import { hasPkgChanged } from './utils/hasPkgChanged'
import { npmPublish } from './utils/npmPublish'
import { updatePackageVersion } from './utils/updatePackageVersion'

const { GIT_COMMITTER_NAME, GIT_COMMITTER_EMAIL, GITHUB_TOKEN } = process.env

if (!GITHUB_TOKEN || !GIT_COMMITTER_NAME || !GIT_COMMITTER_EMAIL) {
  throw new Error(
    'env.GITHUB_TOKEN, env.GIT_COMMITTER_NAME & env.GIT_COMMITTER_EMAIL must be set',
  )
}

// Git configuration
const { repoPublicUrl, repoName } = AuthGithub()
execSync("git fetch origin 'refs/tags/*:refs/tags/*'")
const tags = execSync(`git tag -l --sort=-v:refname`)
  .toString()
  .split('\n')
  .map((tag) => tag.trim())

const changesSinceLastCommit = execSync(
  `git diff ${execSync('git rev-parse HEAD^@')
    .toString()
    .trim()
    .split('\n')
    .at(-1)} HEAD --name-only`,
)
  .toString()
  .trim()
  .split('\n')

let isThereStagedFiles = false

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
                // Thanks for this regex shebang:
                // https://gist.github.com/marcojahn/482410b728c31b221b70ea6d2c433f0c
                const prefixMatcher =
                  prefixes &&
                  new RegExp(
                    `^(${prefixes.join(
                      '|',
                    )}){1}(\\([\\w-\\.]+\\))?(!)?: ([\\w ])+([\\s\\S]*)`,
                  )
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

        const nextReleaseType = releaseSeverityOrder.find((type) =>
          semanticChanges.find(({ releaseType }) => type === releaseType),
        )
        if (!nextReleaseType) {
          console.log(`${pkgName} - no semantic release.`)
          return
        }

        let nextVersion = ''
        console.log(`packages/${dirent.name}/`)
        if (
          lastTag
            ? hasPkgChanged(changesSinceLastCommit, `packages/${dirent.name}/`)
            : true
        ) {
          const lastVersion = execSync(`npm view ${pkgName} version`)
            .toString()
            .trim()

          nextVersion = getNextVersion(
            nextReleaseType,
            `${pkgName}-v${lastVersion}`,
            releasePrefix,
          )!
        } else {
          console.log(`${pkgName} didn't change --skipped`)
          return
        }

        const pkgCWD = pkgJSONPath.replace(`${path.sep}package.json`, '')
        updatePackageVersion(pkgCWD, nextVersion)

        const nextTag = `${pkgName}-v` + nextVersion

        // Generate release notes
        const releaseNotes = generateReleaseNotes(
          nextVersion,
          repoPublicUrl,
          nextTag,
          semanticChanges,
          pkgName,
          lastTag,
        )

        npmPublish(pkgCWD)
        // Add changes like package.json(s)
        const releaseMessage = `chore(release): ${nextTag} [skip ci]`
        execSync(`git add -A .`)
        execSync(`git tag -a ${nextTag} HEAD -m"${releaseMessage}"`)
        isThereStagedFiles = true
        githubRelease(
          nextTag,
          releaseNotes,
          repoName,
          GIT_COMMITTER_NAME,
          GITHUB_TOKEN,
        )
      }
    }
  })

// Commit and Push all staged files
if (isThereStagedFiles) {
  gitRelease()
}
