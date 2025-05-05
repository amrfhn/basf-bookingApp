const { getSequelize, DataTypes, Model } = require('../config')
class Hood extends Model {}

module.exports = Hood

/**
 * @swagger
 * components:
 *   schemas:
 *     Hood:
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *         buildingMindsID:
 *           type: string
 *     Hoods:
 *       type: array
 *       items:
 *         $ref: "#/components/schemas/Hood"
 */
Hood.init(
  {
    name: DataTypes.STRING,
    siteId: DataTypes.INTEGER,
    buildingMindsID: DataTypes.STRING,
  },
  { sequelize: getSequelize(), modelName: 'hood' }
)
