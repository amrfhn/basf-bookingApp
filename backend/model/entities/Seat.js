const { getSequelize, DataTypes, Model } = require('../config')
class Seat extends Model {}

module.exports = Seat

/**
 * @swagger
 * components:
 *   schemas:
 *     Seat:
 *       required:
 *         - code
 *         - areaId
 *         - startDate
 *       properties:
 *         code:
 *           type: string
 *         areaId:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date
 *         endDate:
 *           type: string
 *           format: date
 *         buildingMindsID:
 *           type: string
 *     Seats:
 *       type: array
 *       items:
 *         $ref: "#/components/schemas/Seat"
 */
Seat.init(
  {
    code: DataTypes.STRING,
    areaId: DataTypes.INTEGER,
    startDate: DataTypes.DATEONLY,
    endDate: DataTypes.DATEONLY,
    buildingMindsID: DataTypes.STRING,
  },
  { sequelize: getSequelize(), modelName: 'seat' }
)
