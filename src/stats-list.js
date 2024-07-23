class StatsList {
  constructor({
    title = '', subtitle = '', maxRows = 5,
    sort = function(a, b) { a - b },
    fields = [
      ['foo.mean', 'Mean Task Duration (ms)'],
      ['bar.count', 'Total Count']
    ]
  } = {}, statsStore = null) {
    this.statsStore = statsStore

    this.title = title
    this.subtitle = subtitle
    this.maxRows = maxRows
    this.fields = fields

    this.rows = []
    this.sort = sort
  }

  render() {
    const rows = this.statsStore
      ? [this.statsStore.getRow()]
      : this.rows.slice(this.rows.length - this.maxRows, this.rows.length)

    const values = this.rows
      .sort(this.sort)
      .slice(this.rows.length - this.maxRows, this.rows.length)
      .map(row => {
        return this.fields.reduce((acc, field) => {
          const split = field[0].split('.')
          return {
            ...acc,
            [field[1]] : row[2]
              ? row[2](row[split[0]][split[1]])
              : row[split[0]][split[1]]
          }
        }, {})
      })

    this.title
      ? console.log('Title:', this.title)
      : null

    console.table(values)

    this.subtitle
      ? console.log(this.subtitle)
      : null
  }

  append(row) {
    this.rows.push(row)
  }
}

export { StatsList }
