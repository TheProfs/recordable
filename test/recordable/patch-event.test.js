import test from 'node:test'
import { Recordable } from '../../index.js'

await test('#patchEvent', async t => {
  let recordable

  t.beforeEach(() => {
    recordable = new Recordable({ name: 'foo' })
  })

  await t.test('a value is recorded', async t => {
    let message = null

    t.beforeEach(async () => {
      recordable.ee.on('value:recorded', msg => {
        message = msg
      })

      recordable.record(20)

      return new Promise(res => setTimeout(res, 50))
    })

    await t.test('event is fired', async t => {
      t.assert.ok(message)
    })

    await t.test('message look ok', async t => {
      t.assert.ok(typeof message, 'object')
      t.assert.ok(Object.hasOwn(message, 'name'))
      t.assert.ok(Object.hasOwn(message, 'val'))
    })

    await t.test('has correct values', async t => {
      t.assert.strictEqual(message.name, 'foo')
      t.assert.strictEqual(message.val, 20)
    })
  })
})
