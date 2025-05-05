const { getSequelize, DataTypes, Model } = require('../config')
class WorkspaceType extends Model {}

module.exports = WorkspaceType

/**
 * @swagger
 * components:
 *   schemas:
 *     Status:
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 */
WorkspaceType.init(
  {
    status: DataTypes.STRING,
  },
  { sequelize: getSequelize(), modelName: 'workspaceType' }
)
