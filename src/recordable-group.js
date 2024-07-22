import { Recordable } from './recordable.js'

class RecordableGroup {
  constructor(obj) {
    this.keys = Object.keys(obj)
    Object.assign(this, Object.entries(obj).reduce((acc, entry) => {
      return {
        ...acc,
        [entry[0]]: new Recordable({ name: entry[0] })
      }
    }, {}))
  }

  plot() {
    const arrs = this.keys.map(key => this[key].toHistoricalMeans(10))
    console.log(arrs)
  }
}

export { RecordableGroup }
