import test from 'node:test'
import { Recordable, RecordableGroup } from '../../index.js'

await test('#patchEvent - group', async t => {
  let group, message = null

  t.beforeEach(async () => {
    group = new RecordableGroup('foo', 'bar')
    group.ee.on('value:recorded', msg => {
      message = msg
    })

    group.foo.record(20)

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
