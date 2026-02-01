import express from "express";
const router = express.Router();
import controller from "../controllers/driverController.js";
import pool from "../db.js";


router.post("/location", controller.updateLocation);
router.get("/nearby", controller.getNearbyDrivers);
router.get("/earnings", controller.getEarnings);

export default router;