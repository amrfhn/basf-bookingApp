
export default class Timer {
  constructor () {
    this.start = new Date()
  }

  get time () {
    return new Date() - this.start
  }

  log (name) {
    console.log(name || 'taken:', this.time, 'ms')
  }
}
