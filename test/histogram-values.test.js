import test from 'node:test'
import { Recordable } from '../index.js'

await test('#recordable.histogram values', async t => {
  let recordable

  await t.test('object has recorded values', async t => {
    t.beforeEach(() => {
      recordable = new Recordable()

      recordable.record(10)
      recordable.record(20)
      recordable.record(30)
      recordable.record(40)
      recordable.record(50)
    })

    await t.test('contains properties in milliseconds', async t => {
      await t.test('a min value in ms', t => {
        t.assert.strictEqual(recordable.min, 10)
      })

      await t.test('a mean value in ms', t => {
        t.assert.strictEqual(recordable.mean, 30)
      })

      await t.test('a max value in ms', t => {
        t.assert.strictEqual(recordable.max, 50)
      })

      await t.test('a stddev value in ms', t => {
        t.assert.ok(recordable.stddev > 10, recordable.stddev)
        t.assert.ok(recordable.stddev < 20, recordable.stddev)
      })

      await t.test('percentiles in ms', async t => {
        t.assert.ok(Object.hasOwn(recordable, 'percentiles'))

        await t.test('percentiles in ms', t => {
          t.assert.ok(recordable.percentiles['100'])
        })
      })
    })
  })
})
