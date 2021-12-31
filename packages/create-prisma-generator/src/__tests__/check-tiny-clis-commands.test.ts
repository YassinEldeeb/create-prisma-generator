import { CLIs } from '../tinyClis'
import { serializeCLIs } from './__helpers__/snapshotSerializers'

test('make sure tiny CLIs commands are configured properly', () => {
  expect(serializeCLIs(CLIs)).toMatchSnapshot()
})
