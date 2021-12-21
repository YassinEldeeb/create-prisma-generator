export const yarnWorkspaceJSON = JSON.stringify(
  {
    private: true,
    workspaces: ['packages/*'],
  },
  null,
  2,
)
