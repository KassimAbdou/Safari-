import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { refreshToken } = req.body;
    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      const accessToken = jwt.sign(
        { userId: decoded.userId },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1h' }
      );
      res.json({ accessToken });
    } catch {
      res.status(401).json({ error: 'Refresh token invalide' });
    }
  } else {
    res.status(405).json({ error: 'Méthode non autorisée' });
  }
}
