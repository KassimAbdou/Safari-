import express from 'express';
import auth from '../middleware/auth.js';
import controller from "../controllers/driverController.js";
import pool from "../db.js";


const router = express.Router();

router.post('/drivers/register', auth, controller.registerDriver);
router.post('/drivers/location', auth, controller.updateDriverLocation);
router.get('/drivers/nearby', controller.nearbyDrivers);
router.post('/rides', auth, controller.createRide);
router.get('/rides/history', auth, controller.getRideHistory);

export default router;