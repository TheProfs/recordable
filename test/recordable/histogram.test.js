import test from 'node:test'
import { Recordable } from '../../index.js'

await test('#historicalMeans', async t => {
  let recordable, histogram = null

  t.beforeEach(() => {
    recordable = new Recordable()
  })

  await t.test('instantiates', t => {
    t.assert.ok(recordable, 'is falsy')
  })

  await t.test('"recordable"', async t => {
    t.beforeEach(() => {
      histogram = recordable.histogram
    })

    await t.test('has a histogram property', t => {
      t.assert.ok(Object.hasOwn(recordable, 'histogram'), 'no such property')
    })

    await t.test('of type RecordableHistogram', t => {
      t.assert.strictEqual(histogram.constructor.name, 'RecordableHistogram')
    })

    await t.test('#recordable.histogram.record(val)', async t => {
      await t.test('when passed an invalid value', async t => {
        await t.test('throws an error', t => {
          t.assert.throws(() => {
            histogram.record('')
          }, { name: 'TypeError' })
        })
      })

      await t.test('when passed a valid numeric value', async t => {
        t.beforeEach(() => {
          histogram.record(5)
        })

        await t.test('records it', t => {
          t.assert.strictEqual(recordable.count, 1)
        })

        await t.test('stores the value', t => {
          t.assert.strictEqual(recordable.values.length, 1)
          t.assert.ok(recordable.values.includes(5), 'cannot find 5')
        })
      })
    })
  })
})
