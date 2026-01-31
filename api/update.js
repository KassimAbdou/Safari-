import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token manquant.' });
    }
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const { firstName, lastName, phone, island } = req.body;
      const updatedUser = await prisma.user.update({
        where: { id: decoded.userId },
        data: { firstName, lastName, phone, island },
        select: { id: true, email: true, firstName: true, lastName: true, phone: true, island: true, role: true }
      });
      return res.json({ message: 'Profil mis à jour', user: updatedUser });
    } catch (err) {
      return res.status(500).json({ error: 'Erreur serveur.' });
    }
  } else {
    res.status(405).json({ error: 'Méthode non autorisée' });
  }
}
