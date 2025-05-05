const TWO_SIZED_STR = 2
export const capitalize = str => str.toLowerCase().split(' ')
  .map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ')

export const EIGHTEEN_SECONDS_IN_MILISEC = 18000

export const departmentListOBC03 = [
  { floor: 14, department: ' A/R' },
  { floor: 13, department: 'A/R' },
  { floor: 12, department: 'Cash & Masterdata' },
  { floor: 11, department: 'Cash & Masterdata | Ind. Tax' },
  { floor: 9, department: 'Ind. Tax | P2P' },
  { floor: 8, department: 'P2P' },
  { floor: 7, department: 'P2P' },
  { floor: 6, department: 'P2P' },
  { floor: 5, department: 'P2P' },
  { floor: 4, department: 'People' },
  { floor: 3, department: 'Local HR' },
  { floor: 2, department: 'B2R' },
  { floor: 1, department: '' },
  { floor: 0, department: 'Works Council' }
]

export const departmentListOBC04 = [
  { floor: 5, department: 'Product Safety' },
  { floor: 4, department: 'Product Safety' },
  { floor: 1, department: 'Agri' }
]

export const departmentAreaList = [
  { floor: 14, department: '' },
  { floor: 13, department: '' },
  { floor: 12, department: '' },
  { floor: 11, department: '' },
  { floor: 9, department: '' },
  { floor: 8, department: '' },
  { floor: 7, department: '' },
  { floor: 6, department: '' },
  { floor: 5, department: 'Freights | Overseas & Customs | Domestic' },
  { floor: 4, department: 'People | Talent & Com | HR EMEA' },
  { floor: 3, department: 'Local HR | HR DE | HR LU | HR EMEA' },
  { floor: 2, department: 'B2R' },
  { floor: 1, department: 'B2R | GTU | Project | Site Services' },
  { floor: 0, department: '' }
]

export const departmentMvdList = [
  { floor: 25, department: 'Financial Reporting | Legal | GTU | GD' },
  { floor: 24, department: 'Controlling | Projects | HR | People Services | Comunicación Corporativa | General Management | Facility Management' },
  { floor: 23, department: 'P2P | EHS' },
  { floor: 22, department: 'P2P' },
  { floor: 21, department: 'People Services' },
  { floor: 20, department: 'O2C' },
  { floor: 19, department: 'Supply Chain' },
  { floor: 18, department: 'Business Reporting' }
]

/** * Valid integer (positive or negative) * **/
export function isNumeric (num) {
  return num.match(/^-?\d+$/)
}

export const newFormatDate = (date) => {
  if (date) { return date.getFullYear() + '-' + ('' + (date.getMonth() + 1)).padStart(TWO_SIZED_STR, '0') + '-' + ('' + (date.getDate())).padStart(TWO_SIZED_STR, '0') }
  return null
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

export const groupBy = (array, key) => {
  return array.reduce((result, obj) => {
    (result[obj[key]] = result[obj[key]] || []).push(obj)
    return result
  }, {})
}

// export const newFormatDate = (date) => {
//   return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
// }
