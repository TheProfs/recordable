import test from 'node:test'
import { Recordable } from '../../index.js'

await test('#recordable.histogram_ms', async t => {
  let recordable

  await t.test('object has recorded values', async t => {
    t.beforeEach(() => {
      recordable = new Recordable()

      recordable.record(1000000)
      recordable.record(2000000)
      recordable.record(3000000)
      recordable.record(4000000)
      recordable.record(5000000)
    })

    await t.test('contains properties in milliseconds', async t => {
      await t.test('a min value in ms', t => {
        t.assert.strictEqual(recordable.histogram_ms.min, 1)
      })

      await t.test('a mean value in ms', t => {
        t.assert.strictEqual(recordable.histogram_ms.mean, 3)
      })

      await t.test('a max value in ms', t => {
        t.assert.strictEqual(recordable.histogram_ms.max, 5)
      })

      await t.test('a stddev value in ms', t => {
        t.assert.strictEqual(recordable.histogram_ms.stddev, 1.41)
      })

      await t.test('percentiles in ms', t => {
        t.assert.ok(Object.hasOwn(recordable.histogram_ms, 'percentiles'))
      })
    })
  })
})
