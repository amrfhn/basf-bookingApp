const { getSequelize, DataTypes, Model } = require('../config')
class Brigadier extends Model {}

module.exports = Brigadier

/**
 * @swagger
 * components:
 *   schemas:
 *     Brigadier:
 *       required:
 *         - username
 *         - siteId
 *       properties:
 *         username:
 *           type: string
 *         siteId:
 *           type: integer
 *     Brigadiers:
 *       type: array
 *       items:
 *         $ref: "#/components/schemas/Brigadier"
 */
Brigadier.init(
  {
    username: DataTypes.STRING,
    siteId: DataTypes.INTEGER,
  },
  { sequelize: getSequelize(), modelName: 'brigadier' }
)
