import test from 'node:test'
import { Recordable } from '../../index.js'

await test('#constructor(name)', async t => {
  let recordable = null

  await t.test('"name" parameter', async t => {
    await t.test('is present & valid', async t => {
      t.beforeEach(() => {
        recordable = new Recordable()
      })

      await t.test('instantiates', t => {
        t.assert.ok(recordable)
      })
    })
  })
})
