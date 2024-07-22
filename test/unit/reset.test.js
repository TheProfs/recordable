import test from 'node:test'
import { Recordable } from '../../index.js'
import asciichart from 'asciichart'

await test('#reset()', async t => {
  let recordable = null

  t.beforeEach(() => {
    recordable = new Recordable()

    recordable.histogram.record(10)
    recordable.histogram.record(20)
    recordable.histogram.record(30)
  })

  await t.test('histogram has recorded values', async t => {
    await t.test('histogram has recorded values', t => {
      t.assert.strictEqual(recordable.histogram.count, 3)
      t.assert.ok(recordable.histogram.mean > 0, 'mean is not > 0')
    })

    await t.test('calling the .reset() method', async t => {
      t.beforeEach(() => {
        recordable.reset()
      })

      await t.test('resets the recorded values', t => {
        t.assert.strictEqual(recordable.histogram.count, 0)
        t.assert.strictEqual(recordable.histogram.mean, NaN)
      })

      await t.test('empties the accumulated values', t => {
        t.assert.strictEqual(recordable.values.length, 0)
      })
    })
  })
})
