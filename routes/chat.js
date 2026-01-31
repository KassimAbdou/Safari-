import express from "express";
const router = express.Router();
import auth from "../middleware/auth.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/* =====================================
   📩 Envoyer un message
===================================== */
router.post("/", auth, async (req, res) => {
  const senderId = req.user.id;
  const { receiverId, content } = req.body;

  if (!receiverId || !content) {
    return res.status(400).json({ message: "Données manquantes" });
  }

  const message = await prisma.message.create({
    data: {
      senderId,
      receiverId,
      content
    }
  });

  res.json(message);
});

/* =====================================
   🔄 Charger discussion client ↔ chauffeur
===================================== */
router.get("/:peerId", auth, async (req, res) => {
  const userId = req.user.id;
  const peerId = parseInt(req.params.peerId);

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId, receiverId: peerId },
        { senderId: peerId, receiverId: userId }
      ]
    },
    orderBy: { createdAt: "asc" }
  });

  res.json(messages);
});

/* =====================================
   📋 Liste des conversations pour un utilisateur
===================================== */
router.get("/", auth, async (req, res) => {
  const userId = req.user.id;

  // Trouver tous les interlocuteurs avec qui l'utilisateur a échangé
  const sentMessages = await prisma.message.findMany({
    where: { senderId: userId },
    select: { receiverId: true, receiver: { select: { firstName: true, lastName: true, phone: true, island: true } } }
  });

  const receivedMessages = await prisma.message.findMany({
    where: { receiverId: userId },
    select: { senderId: true, sender: { select: { firstName: true, lastName: true, phone: true, island: true } } }
  });

  const conversations = {};

  sentMessages.forEach(msg => {
    if (!conversations[msg.receiverId]) {
      conversations[msg.receiverId] = {
        id: msg.receiverId,
        name: `${msg.receiver.firstName} ${msg.receiver.lastName}`,
        phone: msg.receiver.phone,
        island: msg.receiver.island
      };
    }
  });

  receivedMessages.forEach(msg => {
    if (!conversations[msg.senderId]) {
      conversations[msg.senderId] = {
        id: msg.senderId,
        name: `${msg.sender.firstName} ${msg.sender.lastName}`,
        phone: msg.sender.phone,
        island: msg.sender.island
      };
    }
  });

  res.json(Object.values(conversations));
});

export default router;