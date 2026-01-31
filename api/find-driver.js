import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { phone } = req.query;
    if (!phone) {
      return res.status(400).json({ error: 'Numéro de téléphone requis' });
    }
    const driver = await prisma.user.findFirst({ where: { phone, role: 'driver' }, select: { id: true, firstName: true, lastName: true, phone: true, island: true } });
    if (!driver) {
      return res.status(404).json({ error: 'Chauffeur non trouvé' });
    }
    res.json(driver);
  } else {
    res.status(405).json({ error: 'Méthode non autorisée' });
  }
}
