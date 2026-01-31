import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { refreshToken } = req.body;
    await prisma.user.updateMany({ where: { refreshToken }, data: { refreshToken: null } });
    res.json({ message: 'Déconnexion réussie' });
  } else {
    res.status(405).json({ error: 'Méthode non autorisée' });
  }
}
