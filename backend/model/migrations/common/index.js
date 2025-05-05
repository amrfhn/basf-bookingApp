module.exports = {
  returning: true,
  startDate: '2021-01-01',
  endDate: '2021-01-01',
  range: (length) => Array.from({ length }, (_, i) => i + 1),
  distinct: (value, index, self) => self.indexOf(value) === index,
  empty: (v) => v.length === 0,
  notEmpty: (v) => v.length > 0,
  getDesk: (o) => o.desk,
  getDock: (o) => o.dock,
  getHeight: (o) => o.height,
  hasDesk: (o) => o.desk && o.desk.length,
  hasHeight: (o) => o.height && o.height.length,
  hasDock: (o) => o.dock && o.dock.length,
  getSeatId: (o) => o.seatId,
  getUsername: (o) => o.username,
  getNewSeat: (o) => o.newSeat,
  getId: (o) => o.id,
  getAreaCode: (o) => o.areaId,
  indexer:
    (indexFunction, valueFunction = (e) => e) =>
    (a, c) => {
      a[indexFunction(c)] = valueFunction(c)
      return a
    },
  difference: (first, second) => first.filter((x) => second.indexOf(x) === -1),
}
