// Config commitlint rules:
// https://github.com/conventional-changelog/commitlint/blob/master/docs/reference-rules.md
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'chore',
        'feat',
        'fix',
        'blog',
        'ci',
        'refactor',
        'perf',
        'revert',
        'style',
        'test',
        'docs',
        'automate',
        'script',
      ],
    ],
  },
}
