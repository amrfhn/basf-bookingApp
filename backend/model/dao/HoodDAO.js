const { Hood, HoodOrgCode, Area, Floor, Building, SeatHood, Seat, config } = require('../model')
const { raw, nest, sequelize } = config
const { Op } = require('sequelize')

const locationByHoodIdQuery = `
SELECT b.name as building,
        b.id as buildingId,
        f.number as floorNumber,
        f.id as floorId,
        a.id as areaId,
        a.code as areaCode,
        h.id as hoodId,
        h.name as hoodName,
        count(s.id)
 FROM hoods as h
        INNER JOIN "seatHoods" sH on h.id = sH."hoodId"
        INNER JOIN seats s on s.id = sH."seatId"
        INNER JOIN areas a on a.id = s."areaId"
        INNER JOIN floors f on f.id = a."floorId"
        INNER JOIN buildings b on b.id = f."buildingId"
 WHERE h.id = :id
 GROUP BY b.name, f.number, a.code, h.id, b.id, f.id, a.id
 ORDER BY "b"."name", "f"."number", "a"."code"`

module.exports = {
  getAll(filter) {
    console.log('GetAll hoods')

    const where = {}
    const include = []

    if (filter) {
      where[Op.and] = []

      if (filter.name) {
        where.name = filter.name
      }

      if (filter.siteId) {
        where.siteId = filter.siteId
      }
      if (filter.buildingMindsID) {
        where.buildingMindsID = filter.buildingMindsID
      }

      if (filter.orgCode) {
        include.push({
          model: HoodOrgCode,
          attributes: [],
        })
        where['$hoodOrgCodes.orgCode$'] = { [Op.eq]: filter.orgCode }
      }
    }
    return Hood.findAll({ raw, nest, where, include })
  },
  get(id) {
    console.log('Get hood', id)
    return Hood.findByPk(id)
  },
  create(data) {
    console.log('Create hood', data)
    return Hood.create(data, { raw, nest })
  },
  update(id, data) {
    console.log('Update hood', id, data)
    return Hood.update(data, { where: { id } }).then(() => Hood.findByPk(id, { raw, nest }))
  },
  delete(id) {
    console.log('Delete hood', id)
    return Hood.findByPk(id, { raw, nest }).then((u) => Hood.destroy({ where: { id } }).then(() => u))
  },
  getOrgCodes(filter) {
    console.log('Get Org Codes')

    const where = {}

    if (filter) {
      where[Op.and] = []

      if (filter.id) {
        where.id = filter.id
      }
      if (filter.name) {
        where.orgCode = filter.orgCode
      }
      if (filter.hoodId) {
        where.hoodId = filter.hoodId
      }
    }

    return HoodOrgCode.findAll({ raw, where, group: ['orgCode', 'id'] })
  },

  async getLocationsByHood(id) {
    return sequelize.query(locationByHoodIdQuery, { replacements: { id }, raw, nest })
  },
}
