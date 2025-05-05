const { getSequelize, DataTypes, Model } = require('../config')
class ExternalUser extends Model {}

module.exports = ExternalUser

/**
 * @swagger
 * components:
 *   schemas:
 *     ExternalUser:
 *       required:
 *         - email
 *         - name
 *         - surname
 *         - company
 *       properties:
 *         email:
 *           type: string
 *         name:
 *           type: string
 *         surname:
 *           type: string
 *         company:
 *           type: string
 *     ExternalUsers:
 *       type: array
 *       items:
 *         $ref: "#/components/schemas/ExternalUser"
 */
ExternalUser.init(
  {
    email: DataTypes.STRING,
    name: DataTypes.STRING,
    surname: DataTypes.STRING,
    company: DataTypes.STRING,
  },
  { sequelize: getSequelize(), modelName: 'externalUser' }
)
