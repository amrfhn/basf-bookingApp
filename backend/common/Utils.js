const UNIX_TIMESTAMP_SIZE_LIMIT = 10
const UTF8 = 'utf8'

function getCurrentUnixTimestamp() {
  return parseInt(Date.now().toString().substring(0, UNIX_TIMESTAMP_SIZE_LIMIT))
}

function getStringBinarySize(string) {
  return Buffer.byteLength(string, UTF8)
}

function getCurrentDateAsStringYYYYMMDD(sliceUntil) {
  return new Date().toISOString().slice(0, sliceUntil)
}

function getCurrentDateAsStringYYYYMMDDPlusDays(sliceUntil, plusDays) {
  const current = new Date()
  current.setDate(current.getDate() + plusDays)
  return current.toISOString().slice(0, sliceUntil)
}

function decodeSlashFromHexNCRToUTF(value) {
  return value.replace('&#x2F;', '/')
}

const OP_CREATE = 'create'
const OP_UPDATE = 'update'
const OP_DELETE = 'delete'

const BM_BOOKING_CANCELATION = 'WorkspaceBookingCancelled'
const BM_BOOKING_COMPLETED = 'WorkspaceBookingCompleted'

const SEAT_BOOKING_TYPE_ID = 1
const PARKING_LOT_BOOKING_TYPE_ID = 2

/** * Status codes ***/
const CREATED_STATUS_CODE = 201
const ACCEPTED_STATUS_CODE = 202
const BAD_REQUEST_STATUS_CODE = 400
const UNAUTHORIZED_STATUS_CODE = 401
const FORBIDDEN_STATUS_CODE = 403
const NOT_FOUND_STATUS_CODE = 404
const METHOD_NOT_ALLOWED = 405
const CONFLICT_STATUS_CODE = 409
const INTERNAL_SERVER_ERROR_STATUS_CODE = 500

/** * Base64 management ***/
const encodeBase64 = (data) => {
  return Buffer.from(data).toString('base64')
}
const decodeBase64 = (data, stringFormat = null) => {
  return !stringFormat ? Buffer.from(data, 'base64') : Buffer.from(data, 'base64').toString(stringFormat)
}

function createDateFromMalformedString(dateString) {
  const dateParts = dateString.split('-')
  const year = parseInt(dateParts[0])
  const month = parseInt(dateParts[1]) - 1
  const day = parseInt(dateParts[2])
  const date = new Date(year, month, day)
  return date
}

function getHourByGMT(gmt) {
  const now = new Date()
  const utcTimestamp = now.getTime() + now.getTimezoneOffset() * 60000
  const offset = gmt * 60 * 60 * 1000
  const localTimestamp = utcTimestamp + offset
  const localDate = new Date(localTimestamp)
  return localDate
}

const groupByUserId = (a, c) => {
  ;(a[c.userId] = a[c.userId] || []).push(c)
  return a
}

const formatDateToYYYYMMHH = (d) => {
  let formattedDate
  formattedDate = d.getFullYear() + '-' + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
  return formattedDate
}

module.exports = {
  getCurrentUnixTimestamp,
  getCurrentDateAsStringYYYYMMDD,
  getStringBinarySize,
  UNIX_TIMESTAMP_SIZE_LIMIT,
  OP_CREATE,
  OP_UPDATE,
  OP_DELETE,
  BM_BOOKING_CANCELATION,
  BM_BOOKING_COMPLETED,
  CREATED_STATUS_CODE,
  ACCEPTED_STATUS_CODE,
  BAD_REQUEST_STATUS_CODE,
  UNAUTHORIZED_STATUS_CODE,
  FORBIDDEN_STATUS_CODE,
  NOT_FOUND_STATUS_CODE,
  METHOD_NOT_ALLOWED,
  CONFLICT_STATUS_CODE,
  INTERNAL_SERVER_ERROR_STATUS_CODE,
  SEAT_BOOKING_TYPE_ID,
  PARKING_LOT_BOOKING_TYPE_ID,
  encodeBase64,
  decodeBase64,
  decodeSlashFromHexNCRToUTF,
  createDateFromMalformedString,
  getHourByGMT,
  getCurrentDateAsStringYYYYMMDDPlusDays,
  groupByUserId,
  formatDateToYYYYMMHH
}
