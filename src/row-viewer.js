class RowViewer {
  constructor({
    title = '', subtitle = '', maxRows = 5, updateInterval = 500,
    sort = function(a, b) { a - b },
    fields = [
      ['foo.mean', 'Mean Task Duration (ms)'],
      ['bar.count', 'Total Count']
    ]
  } = {}, recordableRow = null) {
    this.title = title
    this.subtitle = subtitle
    this.maxRows = maxRows
    this.fields = fields

    this.rows = []
    this.recordableRow = recordableRow
    this.sort = sort
    this.timer = setInterval(this.render.bind(this), updateInterval)
  }

  render() {
    if (this.recordableRow)
      this.append(this.recordableRow.getRow())

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

    console.clear()
    console.log('\n', '\n')

    this.title
      ? console.log('Title:', this.title)
      : null

    console.table(values)

    this.subtitle
      ? console.log(this.subtitle)
      : null

    console.log('\n', '\n')
  }

  append(row) {
    this.rows.push(row)
  }

  stop() {
    clearInterval(this.timer)
  }
}

export default RowViewer
