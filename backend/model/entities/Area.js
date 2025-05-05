const { getSequelize, DataTypes, Model } = require('../config')
class Area extends Model {}

module.exports = Area

/**
 * @swagger
 * components:
 *   schemas:
 *     Area:
 *       required:
 *         - code
 *         - map
 *         - floorId
 *         - startDate
 *       properties:
 *         code:
 *           type: integer
 *         map:
 *           type: text
 *         floorId:
 *           type: integer
 *         buildingMindsID:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date
 *         endDate:
 *           type: string
 *           format: date
 *     Areas:
 *       type: array
 *       items:
 *         $ref: "#/components/schemas/Area"
 */
Area.init(
  {
    code: DataTypes.STRING,
    map: DataTypes.TEXT,
    floorId: DataTypes.INTEGER,
    buildingMindsID: DataTypes.STRING,
    startDate: DataTypes.DATEONLY,
    endDate: DataTypes.DATEONLY,
  },
  { sequelize: getSequelize(), modelName: 'area' }
)
