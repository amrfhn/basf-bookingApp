/** * Valid integer (positive or negative) * **/
export function isNumeric (num) {
  if (num.match(/^-?\d+$/)) {
    return true
  }
  return false
}

export function sortByStrAndNumFloorOrSeat (elems, isFloor) {
  const numElems = []
  const strElems = []
  for (const item of elems) {
    if (isNumeric(isFloor ? item.number : item.code)) { numElems.push(item) } else { strElems.push(item) }
  }
  strElems.sort((s1, s2) => isFloor ? s1.number - s2.number : s1.code - s2.code)
  numElems.sort((s1, s2) => isFloor ? s1.number - s2.number : s1.code - s2.code)
  return [...strElems, ...numElems]
}

const TWO_SIZED_STR = 2

export const newFormatDate = (date) => {
  if (date) { return date.getFullYear() + '-' + ('' + (date.getMonth() + 1)).padStart(TWO_SIZED_STR, '0') + '-' + ('' + (date.getDate())).padStart(TWO_SIZED_STR, '0') }
  return null
}

export const groupBy = (array, key) => {
  return array.reduce((result, obj) => {
    (result[obj[key]] = result[obj[key]] || []).push(obj)
    return result
  }, {})
}

export function getRangeOfDates (initialDate, finalDate) {
  const dateArray = []
  const currentDate = new Date(initialDate)
  // eslint-disable-next-line no-unmodified-loop-condition
  while (currentDate <= finalDate) {
    dateArray.push({ date: new Date(currentDate) })
    currentDate.setDate(currentDate.getDate() + 1)
  }
  return dateArray
}
