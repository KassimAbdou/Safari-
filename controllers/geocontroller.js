const prisma = require('../lib/prisma');

module.exports = {
  listIslands: async (req, res, next) => {
    try {
      const islands = await prisma.island.findMany({
        include: { cities: true }
      });
      res.json(islands);
    } catch (err) { next(err); }
  },

  listCities: async (req, res, next) => {
    try {
      const where = req.query.islandId
        ? { islandId: Number(req.query.islandId) }
        : {};

      const cities = await prisma.city.findMany({ where });
      res.json(cities);
    } catch (err) { next(err); }
  },

  listZones: async (req, res, next) => {
    try {
      const where = req.query.cityId
        ? { cityId: Number(req.query.cityId) }
        : {};

      const zones = await prisma.zone.findMany({ where });
      res.json(zones);
    } catch (err) { next(err); }
  }
};