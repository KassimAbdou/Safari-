import express from "express";
const router = express.Router();
import auth from "../middleware/auth.js";
import { PrismaClient } from "@prisma/client";
import pool from "../db.js";


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
      content,
    },
  });

  res.json(message);
});

/* =====================================
   📨 Récupérer les messages
===================================== */
router.get("/", auth, async (req, res) => {
  const userId = req.user.id;
  const { otherUserId } = req.query;

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId },
      ],
    },
    orderBy: { createdAt: "asc" },
  });

  res.json(messages);
});

/* =====================================
   👥 Conversations
===================================== */
router.get("/conversations", auth, async (req, res) => {
  const userId = req.user.id;

  const conversations = await prisma.message.findMany({
    where: {
      OR: [{ senderId: userId }, { receiverId: userId }],
    },
    include: {
      sender: { select: { id: true, firstName: true, lastName: true } },
      receiver: { select: { id: true, firstName: true, lastName: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // Grouper par conversation
  const convMap = {};
  conversations.forEach((msg) => {
    const otherId = msg.senderId === userId ? msg.receiverId : msg.senderId;
    const otherUser = msg.senderId === userId ? msg.receiver : msg.sender;
    if (!convMap[otherId]) {
      convMap[otherId] = {
        user: otherUser,
        lastMessage: msg,
      };
    }
  });

  res.json(Object.values(convMap));
});

export default router;