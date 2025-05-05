const { getSequelize, DataTypes, Model } = require('../config')
class Booking extends Model {}

module.exports = Booking

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
 *         seatId:
 *           type: integer
 *         calendarId:
 *           type: integer
 *         reserverUserId:
 *           type: string
 *         userId:
 *           type: string
 *         externalUserId:
 *           type: string
 *         status:
 *           type: integer
 *         userOrgCode:
 *           type: string
 *           description: user's org code
 *     Bookings:
 *       type: array
 *       items:
 *         $ref: "#/components/schemas/Booking"
 */
Booking.init(
  {
    seatId: DataTypes.INTEGER,
    calendarId: DataTypes.INTEGER,
    reserverUserId: DataTypes.STRING,
    userId: DataTypes.STRING,
    userOrgCode: DataTypes.STRING,
    externalUserId: DataTypes.INTEGER,
    statusId: DataTypes.INTEGER,
    typeId: DataTypes.INTEGER,
    checkInStatusId: DataTypes.INTEGER
  },
  { sequelize: getSequelize(), modelName: 'booking' }
)
