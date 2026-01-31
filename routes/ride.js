const express = require("express");
const router = express.Router();
const controller = require("../controllers/rideController");
const auth = require("../middleware/auth");

router.post("/", auth, controller.createRide);
router.get("/my", auth, controller.getMyRides);
router.get("/available", auth, controller.getAvailableRides);
router.get("/driver", auth, controller.getMyDriverRides);
router.post("/accept", auth, controller.acceptRide);
router.post("/start", auth, controller.startRide);
router.post("/complete", auth, controller.completeRide);

module.exports = router;