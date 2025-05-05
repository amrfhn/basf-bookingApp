const { getSequelize, DataTypes, Model } = require('../config')
class WorkStreamOrgCode extends Model {}

module.exports = WorkStreamOrgCode

/**
 * @swagger
 * components:
 *   schemas:
 *     WorkStreamOrgCode:
 *       required:
 *         - workStreamId
 *         - orgCode
 *       properties:
 *         workStreamId:
 *           type: integer
 *         orgCode:
 *           type: string
 *     WorkStreamOrgCodes:
 *       type: array
 *       items:
 *         $ref: "#/components/schemas/WorkStreamOrgCode"
 */
WorkStreamOrgCode.init(
  {
    workStreamId: DataTypes.INTEGER,
    orgCode: DataTypes.STRING,
  },
  { sequelize: getSequelize(), modelName: 'workStreamOrgCodes' }
)
