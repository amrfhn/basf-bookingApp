const { getSequelize, DataTypes, Model } = require('../config')
class WorkStream extends Model {}

module.exports = WorkStream

/**
 * @swagger
 * components:
 *   schemas:
 *     WorkStream:
 *       required:
 *         - name
 *         - siteId
 *       properties:
 *         name:
 *           type: string
 *         siteId:
 *           type: number
 *     WorkStreams:
 *       type: array
 *       items:
 *         $ref: "#/components/schemas/WorkStream"
 */
WorkStream.init(
  {
    name: DataTypes.STRING,
    siteId: DataTypes.INTEGER,
  },
  { sequelize: getSequelize(), modelName: 'workStreams' }
)
