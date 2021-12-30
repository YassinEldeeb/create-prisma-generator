export function spyConsole() {
  let spy: any = {}

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
