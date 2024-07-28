import { Recordable } from '../../index.js'

const histogram = new Recordable()

for (let i = 0; i < 600; i++)
  histogram.record(Math.round(Math.random() * 20) + 1)

histogram.plot()
