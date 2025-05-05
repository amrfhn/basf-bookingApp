const { getSequelize, DataTypes, Model } = require('../config')
class Building extends Model {}

module.exports = Building

/**
 * @swagger
 * components:
 *   schemas:
 *     Building:
 *       required:
 *         - name
 *         - address
 *         - reservationDays
 *         - cancellationHours
 *         - reservationCancellationHours
 *         - siteId
 *         - startDate
 *       properties:
 *         name:
 *           type: string
 *         address:
 *           type: string
 *         extras:
 *           type: text
 *         reservationDays:
 *           type: integer
 *         cancellationHours:
 *           type: integer
 *         reservationCancellationHours:
 *           type: integer
 *         managerReservationDays:
 *           type: integer
 *         siteId:
 *           type: integer
 *         buildingMindsID:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date
 *         endDate:
 *           type: string
 *           format: date
 *         gmt:
 *           type: integer
 *     Buildings:
 *       type: array
 *       items:
 *         $ref: "#/components/schemas/Building"
 */
Building.init(
  {
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    image: DataTypes.STRING,
    extras: DataTypes.TEXT,
    reservationDays: DataTypes.SMALLINT,
    managerReservationDays: DataTypes.SMALLINT,
    cancellationHours: DataTypes.SMALLINT,
    reservationCancellationHours: DataTypes.SMALLINT,
    siteId: DataTypes.INTEGER,
    buildingMindsID: DataTypes.STRING,
    startDate: DataTypes.DATEONLY,
    endDate: DataTypes.DATEONLY,
    gmt: DataTypes.SMALLINT,
    parkingReservationDays: DataTypes.INTEGER
  },
  { sequelize: getSequelize(), modelName: 'building' }
)
