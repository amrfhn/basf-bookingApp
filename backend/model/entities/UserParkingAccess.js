const { getSequelize, DataTypes, Model } = require('../config')
class UserParkingAccess extends Model {}

module.exports = UserParkingAccess

/**
 * @swagger
 * components:
 *   schemas:
 *     userParkingAccess:
 *       required:
 *         - userId
 *       properties:
 *         userId:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date
 *         endDate:
 *           type: string
 *           format: date
 *         carBrand:
 *           type: string
 *         carModel:
 *           type: string
 *         carLicensePlate:
 *           type: string
 *         siteId:
 *           type: integer
 *
 *     UserParkingAccess:
 *       type: array
 *       items:
 *         $ref: "#/components/schemas/UserParkingAccess"
 */
UserParkingAccess.init(
  {
    userId: DataTypes.STRING,
    startDate: DataTypes.DATEONLY,
    endDate: DataTypes.DATEONLY,
    carBrand: DataTypes.STRING,
    carModel: DataTypes.STRING,
    carLicensePlate: DataTypes.STRING,
    siteId: DataTypes.INTEGER,
    // accessCard: DataTypes.STRING,
  },
  { sequelize: getSequelize(), modelName: 'userParkingAccess' }
)
