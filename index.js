import { createHistogram } from 'node:perf_hooks'

const nsToMs = ns => Math.round((ns + Number.EPSILON) * 100) / 100 / 1e+6
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
  constructor({ name, values = [], histogram = null }  = {}) {
    this.name = name
    this.values = []

    this.histogram = histogram || createHistogram()

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

  record(val) {
    return this.histogram.record(val)
  }

  reset() {
    this.values = []
    return this.histogram.reset()
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
}

export { Recordable }
