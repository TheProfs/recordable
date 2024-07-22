import test from 'node:test'
import { Recordable } from '../index.js'

await test('#tick()', async t => {
  const recordable = new Recordable()

  await t.test('records a value of 1', async t => {
    recordable.tick()
    recordable.tick()

    t.assert.strictEqual(recordable.histogram.count, 2)
  })
})
