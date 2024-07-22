import test from 'node:test'
import { Recordable } from '../../index.js'

const sleep = (ms = 5) => new Promise(resolve => setTimeout(resolve, ms))

await test('#recordDelta()', async t => {
  let recordable = null

  t.beforeEach(async () => {
    recordable = new Recordable()
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
        console.log(recordable)
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
