import express from "express";
const router = express.Router();
import controller from "../controllers/driverController.js";
import auth from "../middleware/auth.js";
import pool from "../db.js";

router.post("/", auth, controller.createRide);
router.get("/my", auth, controller.getMyRides);
router.get("/available", auth, controller.getAvailableRides);
router.get("/driver", auth, controller.getMyDriverRides);
router.post("/accept", auth, controller.acceptRide);
router.post("/start", auth, controller.startRide);
router.post("/complete", auth, controller.completeRide);

export default router;