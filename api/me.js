import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token manquant' });
    }
    try {
      const token = auth.split(' ')[1];
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
      res.json(user);
    } catch {
      res.status(401).json({ error: 'Token invalide' });
    }
  } else {
    res.status(405).json({ error: 'Méthode non autorisée' });
  }
}
