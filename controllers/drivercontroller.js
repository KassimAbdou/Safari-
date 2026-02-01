import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

/* 🔐 util */
function getUserId(req) {
  const token = req.headers.authorization?.split(" ")[1];
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  return decoded.userId;
}

/* ===============================
   📡 Update position chauffeur
================================ */
export const updateLocation = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { latitude, longitude } = req.body;

    await prisma.driverLocation.upsert({
      where: { driverId: userId },
      update: { latitude, longitude },
      create: { driverId: userId, latitude, longitude }
    });

    res.json({ message: "Position mise à jour" });
  } catch (err) {
    res.status(401).json({ error: "Non autorisé" });
  }
};

/* ===============================
   🚕 Chauffeurs proches (client)
================================ */
export const getNearbyDrivers = async (req, res) => {
  const drivers = await prisma.driverLocation.findMany({
    include: {
      user: {
        select: {
          firstName: true,
          phone: true,
          island: true
        }
      }
    }
  });

  res.json(drivers);
};

/* ===============================
   💰 Gains chauffeur
================================ */
export const getEarnings = async (req, res) => {
  try {
    const userId = getUserId(req);

    // Simulation pour l'instant (remplacer par vraie logique)
    const earnings = {
      today: Math.floor(Math.random() * 10),
      week: Math.floor(Math.random() * 50),
      total: Math.floor(Math.random() * 100000)
    };

    res.json(earnings);
  } catch (err) {
    res.status(401).json({ error: "Non autorisé" });
  }
};

const driverController = {
  updateLocation,
  getNearbyDrivers,
  getEarnings
};

export default driverController;
