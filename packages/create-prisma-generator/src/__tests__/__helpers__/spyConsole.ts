export function spyConsole() {
  let spy: {
    console: jest.SpyInstance<void, [message?: any, ...optionalParams: any[]]>
  } = {} as any

  beforeEach(() => {
    spy.console = jest.spyOn(console, 'log')
  })

  afterEach(() => {
    spy.console.mockClear()
  })

  afterAll(() => {
    spy.console.mockRestore()
  })

  return spy
}
