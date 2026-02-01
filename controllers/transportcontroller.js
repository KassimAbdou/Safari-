import prisma from '../src/lib/prisma.js';

export const registerDriver = async (req, res, next) => {
  try {
    const userId = Number(req.user.id);
    const { vehicleMake, vehicleModel, plate } = req.body;

    const driver = await prisma.driver.create({
      data: { userId, vehicleMake, vehicleModel, plate }
    });

    res.json(driver);
  } catch (err) { next(err); }
};

export const updateDriverLocation = async (req, res, next) => {
  try {
    const userId = Number(req.user.id);
    const { latitude, longitude } = req.body;

    const driver = await prisma.driver.findUnique({ where: { userId }});
    if (!driver) return res.status(404).json({ error: 'Driver not found' });

    const existing = await prisma.driverLocation.findUnique({
      where: { driverId: driver.id }
    });

    let result;

    if (existing) {
      result = await prisma.driverLocation.update({
        where: { driverId: driver.id },
        data: { latitude, longitude }
      });
    } else {
      result = await prisma.driverLocation.create({
        data: { driverId: driver.id, latitude, longitude }
      });
    }

    res.json(result);
  } catch (err) { next(err); }
};

export const nearbyDrivers = async (req, res, next) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng)
      return res.status(400).json({ error: 'Missing lat/lng' });

    const latN = Number(lat),
          lngN = Number(lng);

    const radius = 0.05;

    const drivers = await prisma.driverLocation.findMany({
      where: {
        latitude: { gte: latN - radius, lte: latN + radius },
        longitude: { gte: lngN - radius, lte: lngN + radius }
      },
      include: {
        driver: {
          include: {
            user: true
          }
        }
      }
    });

    res.json(drivers);
  } catch (err) { next(err); }
};

export const createRide = async (req, res, next) => {
  try {
    const userId = Number(req.user.id);
    const { fromZoneId, toZoneId, price } = req.body;

    const ride = await prisma.ride.create({
      data: {
        userId,
        fromZoneId: Number(fromZoneId),
        toZoneId: Number(toZoneId),
        price: Number(price)
      }
    });

    res.status(201).json(ride);
  } catch (err) { next(err); }
};

export const getRideHistory = async (req, res, next) => {
  try {
    const userId = Number(req.user.id);

    const rides = await prisma.ride.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    res.json(rides);
  } catch (err) { next(err); }
};

const transportController = {
  registerDriver,
  updateDriverLocation,
  nearbyDrivers,
  createRide,
  getRideHistory
};

export default transportController;
