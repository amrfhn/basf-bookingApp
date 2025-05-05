const { getSequelize, DataTypes, Model } = require('../config')
class BookingsMeta extends Model {}

module.exports = BookingsMeta

BookingsMeta.init(
  {
    bookingId: DataTypes.INTEGER,
    calendarId: DataTypes.INTEGER,
    statusId: DataTypes.INTEGER,
  },
  { sequelize: getSequelize(), modelName: 'bookingsMeta' }
)