const express = require('express');
const auth = require('../middleware/auth');
const controller = require('../controllers/transportController');

const router = express.Router();

router.post('/drivers/register', auth, controller.registerDriver);
router.post('/drivers/location', auth, controller.updateDriverLocation);
router.get('/drivers/nearby', controller.nearbyDrivers);

router.post('/rides', auth, controller.createRide);
router.get('/rides/history', auth, controller.getRideHistory);

module.exports = router;