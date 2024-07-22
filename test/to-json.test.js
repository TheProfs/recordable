import test from 'node:test'
import { Recordable } from '../index.js'

await test('#record(val)', async t => {
  await t.test('reimporting its JSON revives it to same state', async t => {
    let recordable = null

    t.beforeEach(() => {
      const instance = new Recordable({ name: 'foo' })

      for (let i = 1; i < 101; i++)
        instance.record(i)

      recordable = new Recordable(JSON.parse(JSON.stringify(instance)))
    })

    await t.test('has same name', async t => {
      t.assert.strictEqual(recordable.name, 'foo')
    })

    await t.test('has same values', async t => {
      await t.test('has same count of values', async t => {
        t.assert.strictEqual(recordable.values.length, 100)
      })

      await t.test('has same 1st value', async t => {
        t.assert.strictEqual(recordable.values.at(0), 1)
      })

      await t.test('has same middle value', async t => {
        t.assert.strictEqual(recordable.values.at(49), 50)
      })

      await t.test('has same last value', async t => {
        t.assert.strictEqual(recordable.values.at(-1), 100)
      })
    })

    await t.test('histogram', async t => {
      await t.test('is a RecordableHistogram', async t => {
        const type = recordable.histogram.constructor.name
        t.assert.strictEqual(type, 'RecordableHistogram')
      })

      await t.test('has same count', async t => {
        t.assert.strictEqual(recordable.histogram.count, 100)
      })

      await t.test('has same means', async t => {
        t.assert.strictEqual(recordable.histogram.mean, 50.5)
      })

      await t.test('can record()', async t => {
        t.assert.doesNotThrow(() => {
          recordable.histogram.record(1)
        })
      })
    })
  })
})
