const { getSequelize, DataTypes, Model } = require('../config')
class HoodOrgCode extends Model {}

module.exports = HoodOrgCode

/**
 * @swagger
 * components:
 *   schemas:
 *     HoodOrgCode:
 *       required:
 *         - hoodId
 *         - orgCode
 *       properties:
 *         hoodId:
 *           type: integer
 *         orgCode:
 *           type: string
 *     HoodOrgCodes:
 *       type: array
 *       items:
 *         $ref: "#/components/schemas/HoodOrgCode"
 */
HoodOrgCode.init(
  {
    hoodId: DataTypes.INTEGER,
    orgCode: DataTypes.STRING,
  },
  { sequelize: getSequelize(), modelName: 'hoodOrgCode' }
)
