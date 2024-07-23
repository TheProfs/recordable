class RowViewer {
  constructor({
    title = '',
    subtitle = '',
    maxRows = 5,
    fields = [
      ['foo.mean', 'Mean Task Duration (ms)'],
      ['bar.count', 'Total Count']
    ],
    sort = function(a, b) { a - b },
    updateInterval = 500
  } = {}) {
    this.rows = []
    this.timer = setInterval(() => {
      const values = this.rows
        .sort(sort)
        .slice(this.rows.length - maxRows, this.rows.length)
        .map(row => {
          return fields.reduce((acc, field) => {
            const split = field[0].split('.')
            return {
              ...acc,
              [field[1]] : row.members[split[0]].histogram[split[1]]
            }
          }, {})
        })

      console.clear()
      console.log('\n', '\n')
      if (title)
        console.log('Title:', title)

      console.table(values)

      if (subtitle)
        console.log('Title:', title)

      if (subtitle)
        console.log(subtitle)
    }, updateInterval)
  }

  append(row) {
    this.rows.push(row)
  }

  stop() {
    clearInterval(this.timer)
  }
}

export default RowViewer
