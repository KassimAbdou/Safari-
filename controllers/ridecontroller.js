const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
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
exports.createRide = async (req, res) => {
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
exports.getMyRides = async (req, res) => {
  try {
    const userId = getUserId(req);
    const rides = await prisma.ride.findMany({
      where: { clientId: userId },
      include: {
        driver: {
          select: { firstName: true, lastName: true, phone: true }
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
exports.getMyDriverRides = async (req, res) => {
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
   ✅ Accepter une course (chauffeur)
================================ */
exports.acceptRide = async (req, res) => {
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
exports.startRide = async (req, res) => {
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
exports.completeRide = async (req, res) => {
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