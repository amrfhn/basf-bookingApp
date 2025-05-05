const { getSequelize, DataTypes, Model } = require('../config')
class QuickBooking extends Model {}

module.exports = QuickBooking

/**
 * @swagger
 * components:
 *   schemas:
 *     Booking:
 *       required:
 *         - seatId
 *         - calendarId
 *         - status
 *       properties:
 *         calendarId:
 *           type: integer
 *         userId:
 *           type: string
 *         userOrgCode:
 *           type: string
 *           description: user's org code
 *         status:
 *           type: integer
 *     QuickBookings:
 *       type: array
 *       items:
 *         $ref: "#/components/schemas/Booking"
 */
QuickBooking.init(
  {
    calendarId: DataTypes.INTEGER,
    userId: DataTypes.STRING,
    userOrgCode: DataTypes.STRING,
    siteId: DataTypes.INTEGER,
    buildingId: DataTypes.INTEGER,
    statusId: DataTypes.INTEGER
  },
  { sequelize: getSequelize(), modelName: 'quickBooking' }
)
