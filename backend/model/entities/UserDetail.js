const { getSequelize, DataTypes, Model } = require('../config')
class UserDetail extends Model {}

module.exports = UserDetail

/**
 * @swagger
 * components:
 *   schemas:
 *     userDetails:
 *       required:
 *         - userId
 *         - orgCode
 *       properties:
 *         userId:
 *           type: string
 *         orgCode:
 *           type: string
 *         supervisorId:
 *           type: string
 *
 *     UserDetails:
 *       type: array
 *       items:
 *         $ref: "#/components/schemas/UserDetails"
 */
UserDetail.init(
  {
    orgCode: DataTypes.STRING,
    userId: DataTypes.STRING,
    supervisorId: DataTypes.STRING
  },
  { sequelize: getSequelize(), modelName: 'userDetails' }
)
