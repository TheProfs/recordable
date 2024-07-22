import test from 'node:test'
import { Recordable } from '../../index.js'

await test('#toHistoricalMeans(maxLength)', async t => {
  let recordable, result = null

  t.beforeEach(() => {
    recordable = new Recordable()
  })

  await t.test('passed "maxLength"', async t => {
    await t.test('is not a positive integer', async t => {
      await t.test('throws an error', t => {
        t.assert.throws(() => {
          recordable.toHistoricalMeans(0.01)
        }, { name: 'RangeError' })
      })
    })

    await t.test('is valid', async t => {
      await t.test('has no values', async t => {
        result = recordable.toHistoricalMeans(10)

        await t.test('returns empty array', async t => {
          t.assert.strictEqual(result.length, 0)
        })
      })

      await t.test('has 1 value', async t => {
        t.beforeEach(() => {
          recordable.record(15)
          result = recordable.toHistoricalMeans(10)
        })

        await t.test('returns that 1 value', async t => {
          t.assert.strictEqual(result.length, 1)
          t.assert.strictEqual(result.at(0), 15)
        })
      })

      await t.test('is less than total count of values', async t => {
        t.beforeEach(() => {
          for (let i = 1; i < 1001; i++)
            recordable.record(i)

          result = recordable.toHistoricalMeans(10)
        })

        await t.test('returns count around maxLength', async t => {
          t.assert.strictEqual(result.length, 10)

          await t.test('includes the first value', t => {
            t.assert.strictEqual(result[0], 1)
          })

          await t.test('includes the last value', t => {
            t.assert.strictEqual(result.at(-1), 1000)
          })

          await t.test('includes the in-between as means of values', t => {
            t.assert.strictEqual(result[1], 50.5)
            t.assert.strictEqual(result[4], 350.5)
            t.assert.strictEqual(result[8], 750.5)
          })
        })
      })

      await t.test('is more than total count of values', async t => {
        t.beforeEach(() => {
          result = recordable.toHistoricalMeans(2000)

          for (let i = 1; i < 5 + 1; i++)
            recordable.record(i)
        })

        await t.test('returns all the values', async t => {
          t.assert.strictEqual(result.length, 5)

          await t.test('unchanged', t => {
            t.assert.strictEqual(result.at(0), 1)
            t.assert.strictEqual(result.at(-1), 5)
          })
        })
      })
    })
  })
})
