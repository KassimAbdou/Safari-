const express = require("express");
const router = express.Router();
const controller = require("../controllers/driverController");

router.post("/location", controller.updateLocation);
router.get("/nearby", controller.getNearbyDrivers);
router.get("/earnings", controller.getEarnings);

module.exports = router;