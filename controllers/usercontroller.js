import prisma from '../src/lib/prisma.js';

export const getProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(req.user.id) },
      select: { id: true, email: true, phone: true, fullname: true, role: true, createdAt: true }
    });
    res.json(user);
  } catch (err) { next(err); }
};

export const updateProfile = async (req, res, next) => {
  try {
    const updated = await prisma.user.update({
      where: { id: Number(req.user.id) },
      data: req.body
    });
    res.json(updated);
  } catch (err) { next(err); }
};