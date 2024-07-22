import test from 'node:test'
import { Recordable } from '../index.js'

await test('#plot()', async t => {
  let plot = null

  t.beforeEach(() => {
    const recordable = new Recordable()

    recordable.histogram.record(13)
    recordable.histogram.record(20)
    recordable.histogram.record(36)

    plot = recordable.plot()
  })

  await t.test('returns a plot', async t => {
    t.assert.ok(plot)
  })

  await t.test('plot includes the min', async t => {
    t.assert.ok(plot.includes('13.00'), 'plot doesnt plot min value')
  })

  await t.test('plot includes the max', async t => {
    t.assert.ok(plot.includes('36.00'), 'plot doesnt plot max value')
  })
})
