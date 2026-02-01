import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

/* 🔐 util */
function getUserId(req) {
  const token = req.headers.authorization?.split(" ")[1];
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  return decoded.userId;
}

/* ================================
   📍 Créer une course
================================ */
export const createRide = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { pickupLat, pickupLng, dropoffLat, dropoffLng, driverId } = req.body;

    if (!pickupLat || !pickupLng) {
      return res.status(400).json({ message: "Position de départ requise" });
    }

    const ride = await prisma.ride.create({
      data: {
        clientId: userId,
        driverId: driverId || null,
        pickupLat,
        pickupLng,
        dropoffLat,
        dropoffLng,
        status: driverId ? "accepted" : "requested" // Si chauffeur spécifié, directement accepté
      }
    });

    res.json(ride);
  } catch (err) {
    res.status(500).json({ error: "Erreur création course" });
  }
};

/* ================================
   📋 Mes courses (client)
================================ */
export const getMyRides = async (req, res) => {
  try {
    const userId = getUserId(req);
    const rides = await prisma.ride.findMany({
      where: { clientId: userId },
      include: {
        driver: {
          select: { firstName: true, lastName: true, lastName: true, phone: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });
    res.json(rides);
  } catch (err) {
    res.status(500).json({ error: "Erreur récupération courses" });
  }
};

/* ================================
   🚕 Mes courses (chauffeur)
================================ */
export const getMyDriverRides = async (req, res) => {
  try {
    const userId = getUserId(req);
    const rides = await prisma.ride.findMany({
      where: { driverId: userId },
      include: {
        client: {
          select: { firstName: true, lastName: true, phone: true, island: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });
    res.json(rides);
  } catch (err) {
    res.status(500).json({ error: "Erreur récupération courses chauffeur" });
  }
};

/* ================================
   📋 Courses disponibles (chauffeur)
================================ */
export const getAvailableRides = async (req, res) => {
  try {
    const rides = await prisma.ride.findMany({
      where: { status: "requested" },
      include: {
        client: {
          select: { firstName: true, lastName: true, phone: true, island: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });
    res.json(rides);
  } catch (err) {
    res.status(500).json({ error: "Erreur récupération courses disponibles" });
  }
};

/* ================================
   ✅ Accepter une course (chauffeur)
================================ */
export const acceptRide = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { rideId } = req.body;

    const ride = await prisma.ride.update({
      where: { id: rideId },
      data: { driverId: userId, status: "accepted" }
    });

    res.json(ride);
  } catch (err) {
    res.status(500).json({ error: "Erreur acceptation course" });
  }
};

/* ================================
   🚀 Démarrer course
================================ */
export const startRide = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { rideId } = req.body;

    const ride = await prisma.ride.findFirst({
      where: { id: rideId, driverId: userId }
    });

    if (!ride) return res.status(404).json({ message: "Course non trouvée" });

    await prisma.ride.update({
      where: { id: rideId },
      data: { status: "in_progress" }
    });

    res.json({ message: "Course démarrée" });
  } catch (err) {
    res.status(500).json({ error: "Erreur démarrage course" });
  }
};

/* ================================
   🏁 Terminer course
================================ */
export const completeRide = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { rideId } = req.body;

    const ride = await prisma.ride.findFirst({
      where: { id: rideId, driverId: userId }
    });

    if (!ride) return res.status(404).json({ message: "Course non trouvée" });

    await prisma.ride.update({
      where: { id: rideId },
      data: { status: "completed" }
    });

    res.json({ message: "Course terminée" });
  } catch (err) {
    res.status(500).json({ error: "Erreur fin course" });
  }
};

/* ================================
   📍 Partager position avec chauffeur
================================ */
export const shareLocation = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { driverId, latitude, longitude } = req.body;

    // Ici, on peut stocker la position partagée, ou notifier le chauffeur
    // Pour l'instant, on simule en créant une entrée ou en loggant

    console.log(`Position partagée par client ${userId} avec chauffeur ${driverId}: ${latitude}, ${longitude}`);

    // Peut-être envoyer une notification ou créer une course

    res.json({ message: "Position partagée avec succès" });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors du partage de la position" });
  }
};

const rideController = {
  createRide,
  getMyRides,
  getAvailableRides,
  getMyDriverRides,
  acceptRide,
  startRide,
  completeRide,
  shareLocation
};

export default rideController;
