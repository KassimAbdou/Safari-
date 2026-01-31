import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { firstName, lastName, email, phone, island, role, password } = req.body;
    if (!firstName || !lastName || !email || !phone || !island || !role || !password) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'Email déjà utilisé' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { firstName, lastName, email, phone, island, role, password: hashedPassword }
    });
    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1h' }
    );
    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );
    await prisma.user.update({ where: { id: user.id }, data: { refreshToken } });
    res.status(201).json({ message: 'Inscription réussie', accessToken, refreshToken, user });
  } else {
    res.status(405).json({ error: 'Méthode non autorisée' });
  }
}
