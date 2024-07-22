import { createHistogram } from 'node:perf_hooks'
import asciichart from 'asciichart'

const toDecimal = num => Math.round((num + Number.EPSILON) * 100) / 100
const nanosToMs = nanos => toDecimal(nanos / 1e+6)
const nanoKeysToMs = obj => (acc, key) => ({
  ...acc,
  [key]: isNaN(obj[key]) ? 0 : nanosToMs(obj[key])
})

class HistogramMs {
  constructor(histogram) {
    Object.assign(this, {
      ...histogram,
      ...['min','mean','max','stddev']
            .reduce(nanoKeysToMs(histogram), {
        percentiles: Object.keys(histogram.percentiles)
            .reduce(nanoKeysToMs(histogram.percentiles), {})
      })
    })
  }
}

class Recordable {
  constructor({ name, values = [] }  = {}) {
    this.name = name
    this.values = values
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

  count() {
    return this.record(1)
  }

  record(val) {
    return this.histogram.record(val)
  }

  reset() {
    this.values = []
    return this.histogram.reset()
  }

  plot () {
    const width  = process.stdout.columns - 40
    const height = process.stdout.rows - 15
    const values = this.toHistoricalMeans(width)

    console.clear()
    console.log(
      '\n'.repeat(5), asciichart.plot(values,
      { height, colors: [ asciichart.green ] }
    ))
  }

  toHistoricalMeans(maxLength) {
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
