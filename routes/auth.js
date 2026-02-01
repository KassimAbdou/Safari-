import express from "express";
import { body } from "express-validator";
import controller from "../controllers/authController.js";
import pool from "../db.js";



const router = express.Router();

router.post(
  "/register",
  [
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("firstName").notEmpty(),
    body("lastName").notEmpty(),
    body("phone").notEmpty(),
    body("island").notEmpty(),
    body("role").notEmpty(),
  ],
  controller.register
);

router.post("/login", controller.login);
router.get("/me", controller.me);
router.post("/refresh", controller.refresh);
router.post("/logout", controller.logout);
// Mise à jour du profil utilisateur
router.put('/update', controller.updateProfile);
// Trouver chauffeur par téléphone
router.get('/find-driver', controller.findDriver);

export default router;