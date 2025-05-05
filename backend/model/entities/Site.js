const { getSequelize, DataTypes, Model } = require('../config')
class Site extends Model {}

module.exports = Site

/**
 * @swagger
 * components:
 *   schemas:
 *     Site:
 *       required:
 *         - name
 *         - country
 *         - city
 *         - startDate
 *       properties:
 *         name:
 *           type: string
 *         country:
 *           type: string
 *         city:
 *           type: string
 *         managerRoleId:
 *           type: integer
 *         adminRoleId:
 *           type: integer
 *         buildingMindsID:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date
 *         endDate:
 *           type: string
 *           format: date
 *         feedbackContact:
 *           type: string
 *     Sites:
 *       type: array
 *       items:
 *         $ref: "#/components/schemas/Site"
 */
Site.init(
  {
    name: DataTypes.STRING,
    country: DataTypes.STRING,
    city: DataTypes.STRING,
    managerRoleId: DataTypes.INTEGER,
    adminRoleId: DataTypes.INTEGER,
    buildingMindsID: DataTypes.STRING,
    startDate: DataTypes.DATEONLY,
    endDate: DataTypes.DATEONLY,
    feedbackContact: DataTypes.STRING,
    anonymizationDaysConfig: DataTypes.INTEGER,
    previousAnonymizationDaysValue: DataTypes.INTEGER,
    prevAnonDaysValueChangedDate: DataTypes.DATEONLY,
    deletionDays: DataTypes.INTEGER,
  },
  { sequelize: getSequelize(), modelName: 'site' }
)
