import { Recordable } from './recordable.js'

class RecordableRow {
  constructor(...args) {
    Object.assign(this, args.reduce((acc, name) => {
      return { ...acc, [name]: new Recordable({ name }) }
    }, {}))
  }

  getMembers() {
    return Object.values(this)
      .filter(value => value instanceof Recordable)
  }

  getRow() {
    return this.getMembers().reduce((acc, member) => {
      acc.members[member.name] = {
        histogram: member.histogram.toJSON()
      }

      return acc
    }, {
      id: process.pid,
      members: []
    })
  }
}

export { RecordableRow }
