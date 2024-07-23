import { EventEmitter } from 'node:events'
import { Recordable } from './recordable.js'

import asciichart from 'asciichart'
import colorlist from './colorlist.js'

const colors = Object.values(colorlist)
const round = num => Math.round((num + Number.EPSILON) * 100) / 100

class RecordableGroup {
  constructor(...args) {
    this.ee = new EventEmitter()

    Object.assign(this, args.reduce((acc, name) => {
      return { ...acc, [name]: this.createNewRecordable(name) }
    }, {}))
  }

  histograms({ maxRows, sortBy, title = 'Untitled' }) {
    return this.print({
      ...{ maxRows, sortBy },
      transformFn: ({ key, value }) => {
        const histogram = value.histogram.toJSON()

        return {
          'count'     : histogram.count,
          'min (ms)'  : round(histogram.min),
          'mean (ms)' : round(histogram.mean),
          'max (ms)'  : round(histogram.max),
          'dev (ms)'  : round(histogram.stddev),
        }
      }
    })
  }

  print({
    title = '',
    maxRows = Infinity,
    sortBy = 'pid',
    transformFn = () => {}
  } = {}) {
    const values = Object.entries(this)
      .filter(entry => entry[1] instanceof Recordable)
      .sort((a, b) => b[sortBy] - a[sortBy])
      .slice(0, maxRows)
      .map(([key, value]) => transformFn({ key, value }))

    console.clear()
    console.log('\n', '\n')
    console.log('Title:', title)
    console.table(values)

    const hidden = this.getMembers().length - maxRows

    if (hidden > 1)
      console.log('... plus:',  hidden, 'hidden')

    console.log('\n')
  }

  plot() {
    const width  = (process.stdout.columns || 100) - 40
    const height = (process.stdout.rows || 30) - 15
    const values = this.getMembers()
      .map((member, i) => ({
        ...member,
        averages: member.toClampedAverages(width),
        color: colors[i % colors.length],
        name: member.name
      })).filter(member => member.averages.length)

    const plot = values.map(member => member.averages).length
      ? asciichart.plot(values.map(member => member.averages), {
        height, colors: values.map(member => member.color)
      }) : null

    console.clear()

    if (!values.length)
      return console.info('not enough data to plot yet ...')

    plot ? console.log('\n'.repeat(5), plot)
         : console.info('\n'.repeat(5), 'not enough plot data yet ...')

    return plot
  }

  createNewRecordable(name) {
    const instance = new Recordable({ name })

    instance.on('value:recorded', this.emitPatchEvent.bind(this))

    return instance
  }

  applyRemotePatch(patch) {
    const member = this[name]

    if (member)
      member.applyRemotePatch(patch)

    return !!member
  }

  emitPatchEvent(message) {
    this.ee.emit('value:recorded', message)
  }

  getMembers() {
    return Object.values(this)
      .filter(value => value instanceof Recordable)
  }

  bindForUpdates(patch) {
    if (patch && patch.type !== 'value:recorded')
      return

    return this.applyRemotePatch(patch)
  }

  on(...args) {
    return this.ee.on(...args)
  }
}

export { RecordableGroup }
