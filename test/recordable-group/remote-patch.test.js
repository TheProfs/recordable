import test from 'node:test'
import { Recordable, RecordableGroup } from '../../index.js'

await test('#applyRemotePatch', async t => {
  let group, recordable

  t.beforeEach(() => {
    recordable = new Recordable()
    group = new RecordableGroup('foo', 'bar')
  })

  await t.test('nobody in group has name of patch', async t => {
    group.applyRemotePatch({ name: 'baz', val: 10 })
    await t.test('count stays same', t => {
      t.assert.strictEqual(group.foo.count, 0)
      t.assert.strictEqual(group.bar.count, 0)
    })
  })

  await t.test('one member has the name of patch', async t => {
    t.beforeEach(() => {
      for (let i = 0; i < 20; i++)
        group.applyRemotePatch({ name: 'foo', val: 10  })
    })

    await t.test('it is applied to him', async t => {
      await t.test('does not emit "value:recorded" event', async t => {
        recordable.ee.on('value:recorded', e => {
          throw new Error("erroneously called")
        })

        group.applyRemotePatch({ name: 'foo', val: 10  })
        await new Promise(resolve => setTimeout(resolve, 25))
      })

      await t.test('increases count', t => {
        t.assert.strictEqual(group.foo.count, 20)
        t.assert.strictEqual(group.bar.count, 0)
      })

      await t.test('increases mean', t => {
        t.assert.strictEqual(group.foo.mean, 10)
      })

      await t.test('adds to items', t => {
        t.assert.strictEqual(group.foo.values.length, 20)
      })
    })
  })

  await t.test('patch is valid', async t => {
    t.beforeEach(() => {
      group.applyRemotePatch({ name: 'foo', val: 10  })
      group.applyRemotePatch({ name: 'foo', val: 20  })
    })

    await t.test('does not throw error', t => {
      t.assert.doesNotThrow(() => {
        group.applyRemotePatch({ name: 'foo', val: 10  })
      })
    })

    await t.test('does not emit "value:recorded" event', async t => {
      group.foo.ee.on('value:recorded', e => {
        throw new Error("erroneously called")
      })

      group.applyRemotePatch({ name: 'foo', val: 10  })
      await new Promise(resolve => setTimeout(resolve, 25))
    })

    await t.test('increases count', t => {
      t.assert.strictEqual(group.foo.count, 2)
    })

    await t.test('increases mean', t => {
      t.assert.strictEqual(group.foo.mean, 15)
    })

    await t.test('adds to items', t => {
      t.assert.strictEqual(group.foo.values.length, 2)
    })
  })
})
