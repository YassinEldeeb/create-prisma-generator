declare namespace NodeJS {
  export interface ProcessEnv {
/**
     * @example
     * ```
    process.env.GIT_COMMITTER_NAME
    ```
     */
    GIT_COMMITTER_NAME: string
/**
     * @example
     * ```
    process.env.GIT_COMMITTER_EMAIL
    ```
     */
    GIT_COMMITTER_EMAIL: string
/**
     * @example
     * ```
    process.env.GITHUB_TOKEN
    ```
     */
    GITHUB_TOKEN: string
  }
}
