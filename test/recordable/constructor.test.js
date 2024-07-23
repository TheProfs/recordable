import test from 'node:test'
import { Recordable } from '../../index.js'

await test('#constructor(name)', async t => {
  let recordable = null

  await t.test('"name" parameter', async t => {
    await t.test('is present & valid', async t => {
      t.beforeEach(() => {
        recordable = new Recordable({ name: 'foo' })
      })

      await t.test('instantiates', async t => {
        t.assert.ok(recordable)

        await t.test('with the name', t => {
          t.assert.strictEqual(recordable.name, 'foo')
        })
      })
    })

    await t.test('is not present', async t => {
      await t.test('does not throw', t => {
        t.assert.doesNotThrow(() => {
          recordable = new Recordable()
        })
      })
    })
  })
})
