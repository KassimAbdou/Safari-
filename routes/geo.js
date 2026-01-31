const express = require('express');
const controller = require('../controllers/geoController');

const router = express.Router();

router.get('/islands', controller.listIslands);
router.get('/cities', controller.listCities);
router.get('/zones', controller.listZones);

module.exports = router;