import { CLIs } from '../tinyClis'
import { serializeCLI } from './__helpers__/snapshotSerializers'

Object.keys(CLIs).forEach((cli) => {
  test(`${cli} command is configured properly`, () => {
    expect(serializeCLI(cli as keyof typeof CLIs)).toMatchSnapshot()
  })
})
