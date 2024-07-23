class StatsView {
  constructor(lists, {
    title = '',
    subtitle = '',
    updateInterval = 500
  } = {}) {
    this.title = title
    this.subtitle = subtitle
    this.lists = lists

    this.timer = setInterval(this.render.bind(this), updateInterval)
  }

  render() {
    console.clear()

    console.log('\n')

    this.title
      ? console.log('Title:', this.title)
      : null

    this.lists.forEach(list => {
      list.render()
      console.log('\n')
    })

    console.log('\n')
  }

  stop() {
    clearInterval(this.timer)
  }
}

export { StatsView }
