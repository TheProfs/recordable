import { createHistogram } from 'node:perf_hooks'
import { HistogramMs } from './histogram-ms.js'
import asciichart from 'asciichart'

class Recordable {
  constructor({ name, values = [] }  = {}) {
    this.name = name
    this.values = values
    this.deltaKeys = {}
    this.histogram = values.length
      ? this.#createHistogramFromValues(values)
      : createHistogram()

    Object.defineProperty(this, 'histogram_ms', {
      get: function() { return new HistogramMs(this.histogram) }
    })

    this._recordFn = this.histogram.record.bind(this.histogram)
    this.histogram.record = val => {
      const result = this._recordFn(val)

      this.values.push(val)

      return result
    }
  }

  recordDelta(key = 'any') {
    if (typeof key !== 'string')
      throw new RangeError('"key" must be a string with length')

    if (!this.deltaKeys[key]) {
      this.deltaKeys[key] = performance.now()

      return 0
    }

    const delta = parseInt(performance.now() - this.deltaKeys[key])

    this.record(delta)

    this.deltaKeys[key] = performance.now()

    return delta
  }

  tick() {
    this.record(1)

    return this.values.length
  }

  record(val) {
    return this.histogram.record(val)
  }

  reset() {
    this.values = []
    return this.histogram.reset()
  }

  plot () {
    const width  = (process.stdout.columns || 100) - 40
    const height = (process.stdout.rows || 30) - 15
    const values = this.toClampedAverages(width)
    const plot   = values.length ? asciichart.plot(values, {
      height, colors: [ asciichart.green ]
    }) : null

    console.clear()

    if (!values.length)
      return console.info('not enough data to plot yet ...')

    plot
      ? console.log('\n'.repeat(5), plot)
      : console.info('\n'.repeat(5), 'not enough plot data yet ...')

    return plot
  }

  toClampedAverages(maxLength) {
    if (!Number.isSafeInteger(maxLength))
      throw new RangeError('"maxLength" must be a positive integer')

    return this.values.length < maxLength
      ? this.values
      : this.values.reduce((acc, value, i, arr) => {
        if (i % Math.ceil(this.values.length / maxLength) === 0)
          acc.push(createHistogram())

        acc.at(-1).record(value)

        return i === arr.length - 1
          ? [this.values.at(0)]
            .concat(acc.map(histogram => histogram.mean)).slice(0, acc.length - 1)
            .concat(this.values.at(-1))
          : acc
      }, [])
  }

  #createHistogramFromValues(values) {
    return values.reduce((histogram, value) => {
      histogram.record(value)

      return histogram
    }, createHistogram())
  }
}

export { Recordable }
