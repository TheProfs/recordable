import test from 'node:test'
import { Recordable } from '../../index.js'

const sleep = (ms = 5) => new Promise(resolve => setTimeout(resolve, ms))

await test('#recordDelta()', async t => {
  let recordable = null

  t.beforeEach(async () => {
    recordable = new Recordable()
  })

  await t.test('When the key', async t => {
    await t.test('is set for the first time', async t => {
      await t.test('returns 0', t => {
        const result = recordable.recordDelta('baz123')

        t.assert.strictEqual(result, 0)
      })
    })

    await t.test('matches with open key', async t => {
      await t.test('returns the delta', async t => {
        recordable.recordDelta('baz456')

        await sleep(5)

        const result = recordable.recordDelta('baz456')

        t.assert.ok(result > 0)
        t.assert.ok(result < 10)
      })
    })
  })


  await t.test('When key is not passed', async t => {
    t.beforeEach(async () => {
      recordable.recordDelta('bar')
      await sleep(25)
      recordable.recordDelta('foo')
      await sleep(15)
      recordable.recordDelta('foo')
      await sleep(5)
      recordable.recordDelta('foo')
      await sleep(10)
      recordable.recordDelta('bar')
    })

    await t.test('matches with previous entries with no key', async t => {
      await t.test('recorded 3 values', t => {
        t.assert.strictEqual(recordable.values.length, 3)
      })

      await t.test('1st and last values are about ok', t => {
        t.assert.ok(recordable.values.at(0) - 15 < 5) // tolerance
        t.assert.ok(recordable.values.at(-1) - 55 < 10) // tolerance
      })
    })
  })

  await t.test('When a key is provided', async t => {
    t.beforeEach(async () => {
      recordable.recordDelta('bar')
      recordable.recordDelta('foo')
      await sleep(10)
      recordable.recordDelta('foo')
      await sleep(10)
      recordable.recordDelta('foo')
      await sleep(5)
      recordable.recordDelta('bar')
    })

    await t.test('recorded 4 values', t => {
      t.assert.strictEqual(recordable.values.length, 3)
    })

    await t.test('1st and last values are about ok', t => {
      t.assert.ok(recordable.values.at(0) - 15 < 5) // tolerance
      t.assert.ok(recordable.values.at(-1) - 50 < 10) // tolerance
    })
  })
})
