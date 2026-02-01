import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/* REGISTER */
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, island, role, password } = req.body;

    if (!firstName || !lastName || !email || !phone || !island || !role || !password) {
      return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: "Email déjà utilisé" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { firstName, lastName, email, phone, island, role, password: hashedPassword }
    });

    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken }
    });

    res.status(201).json({
      message: "Inscription réussie",
      accessToken,
      refreshToken,
      user
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

/* LOGIN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: "Identifiants incorrects" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: "Identifiants incorrects" });

    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken }
    });

    res.json({ accessToken, refreshToken, user });

  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

/* ME */
export const me = async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token manquant" });
    }

    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    res.json(user);

  } catch {
    res.status(401).json({ error: "Token invalide" });
  }
};

/* REFRESH */
export const refresh = async (req, res) => {

  try {
    const { refreshToken } = req.body;

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ accessToken });

  } catch {
    res.status(401).json({ error: "Refresh token invalide" });
  }
};

/* LOGOUT */
export const logout = async (req, res) => {
  const { refreshToken } = req.body;
  await prisma.user.updateMany({
    where: { refreshToken },
    data: { refreshToken: null }
  });
  res.json({ message: "Déconnexion réussie" });
};
// ==========================================
// UPDATE PROFILE
// ==========================================
export const updateProfile = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token manquant." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const { firstName, lastName, phone, island } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: decoded.userId },
      data: {
        firstName,
        lastName,
        phone,
        island
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        island: true,
        role: true
      }
    });

    return res.json({
      message: "Profil mis à jour",
      user: updatedUser
    });

  } catch (err) {
    console.error("Erreur updateProfile:", err);
    return res.status(500).json({ error: "Erreur serveur." });
  }
};

/* ================================
   Trouver chauffeur par téléphone
================================ */
export const findDriver = async (req, res) => {
  try {
    const { phone } = req.query;

    if (!phone) {
      return res.status(400).json({ error: "Numéro de téléphone requis" });
    }

    const driver = await prisma.user.findFirst({
      where: {
        phone: phone,
        role: "driver"
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phone: true,
        island: true
      }
    });

    if (!driver) {
      return res.status(404).json({ error: "Chauffeur non trouvé" });
    }

    res.json(driver);
  } catch (err) {
    console.error("Erreur findDriver:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

const authController = {
  register,
  login,
  me,
  refresh,
  logout,
  updateProfile,
  findDriver
};

export default authController;
