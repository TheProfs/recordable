import test from 'node:test'
import { Recordable } from '../../index.js'

await test('#applyRemotePatch', async t => {
  let recordable

  t.beforeEach(() => {
    recordable = new Recordable({ name: 'foo' })
  })

  await t.test('name is different', async t => {
    await t.test('throws Error', t => {
      t.assert.throws(() => {
        recordable.applyRemotePatch({ name: 'bar', val: 10 })
      }, {
        name: 'RangeError'
      })
    })
  })

  await t.test('value is not a positive integer', async t => {
    await t.test('throws Error', t => {
      t.assert.throws(() => {
        recordable.applyRemotePatch({ name: 'foo', val: 0 })
      }, {
        name: 'RangeError'
      })
    })
  })

  await t.test('patch is valid', async t => {
    t.beforeEach(() => {
      recordable.applyRemotePatch({ name: 'foo', val: 10  })
      recordable.applyRemotePatch({ name: 'foo', val: 20  })
    })

    await t.test('does not throw error', t => {
      t.assert.doesNotThrow(() => {
        recordable.applyRemotePatch({ name: 'foo', val: 10  })
      })
    })

    await t.test('does not emit "value:recorded" event', async t => {
      recordable.ee.on('value:recorded', e => {
      })

      recordable.applyRemotePatch({ name: 'foo', val: 10  })
      await new Promise(resolve => setTimeout(resolve, 25))
    })

    await t.test('increases count', t => {
      t.assert.strictEqual(recordable.count, 2)
    })

    await t.test('increases mean', t => {
      t.assert.strictEqual(recordable.mean, 15)
    })

    await t.test('adds to items', t => {
      t.assert.strictEqual(recordable.values.length, 2)
    })
  })
})
