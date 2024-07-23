import test from 'node:test'
import { Recordable } from '../../index.js'

await test('#record(val)', async t => {
  let recordable

  t.beforeEach(() => {
    recordable = new Recordable()
  })

  await t.test('"value" parameter', async t => {
    await t.test('is missing', async t => {
      await t.test('throws an error', t => {
        t.assert.throws(() => {
          recordable.record()
        }, { name: 'TypeError' })
      })

      await t.test('is a float', async t => {
        await t.test('throws an error', t => {
          t.assert.throws(() => {
            recordable.record(0.01)
          }, { name: 'RangeError' })
        })
      })

      await t.test('is a negative integer', async t => {
        await t.test('throws an error', t => {
          t.assert.throws(() => {
            recordable.record(0.01)
          }, { name: 'RangeError' })
        })
      })
    })

    await t.test('is present & valid', async t => {
      t.beforeEach(() => {
        recordable.record(10)
      })

      await t.test('records its own value', t => {
        t.assert.strictEqual(recordable.histogram.count, 1)
      })

      await t.test('in its histogram', t => {
        t.assert.strictEqual(recordable.histogram.count, 1)
      })
    })
  })
})
