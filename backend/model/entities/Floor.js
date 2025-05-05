const { getSequelize, DataTypes, Model } = require('../config')
class Floor extends Model {}

module.exports = Floor

/**
 * @swagger
 * components:
 *   schemas:
 *     Floor:
 *       required:
 *         - number
 *         - map
 *         - buildingId
 *         - startDate
 *       properties:
 *         number:
 *           type: integer
 *         map:
 *           type: string
 *         buildingId:
 *           type: integer
 *         buildingMindsID:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date
 *         endDate:
 *           type: string
 *           format: date
 *         landingZones:
 *           type: string
 *       example:
 *         number: 5
 *         map: <svg/>
 *         buildingId: 1
 *         startDate: '2021-01-01'
 *         endDate: '2021-12-31'
 *         lanzingZones: 'GTU'
 *     Floors:
 *       type: array
 *       items:
 *         $ref: "#/components/schemas/Floor"
 */
Floor.init(
  {
    number: DataTypes.INTEGER,
    map: DataTypes.TEXT,
    buildingId: DataTypes.INTEGER,
    buildingMindsID: DataTypes.STRING,
    startDate: DataTypes.DATEONLY,
    endDate: DataTypes.DATEONLY,
    landingZones: DataTypes.TEXT,
  },
  { sequelize: getSequelize(), modelName: 'floor' }
)
