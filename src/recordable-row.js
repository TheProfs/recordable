import { Recordable } from './recordable.js'

class RecordableRow {
  constructor(...args) {
    Object.assign(this, args.reduce((acc, name) => {
      return { ...acc, [name]: new Recordable({ name }) }
    }, {}))
  }

  getMembers() {
    return Object.values(this).filter(value => value instanceof Recordable)
  }

  getRow() {
    return this.getMembers().reduce((acc, member) => {
      return {
        ...acc, [member.name]: member.histogram.toJSON()
      }
    }, { id: process.pid })
  }
}

export { RecordableRow }
