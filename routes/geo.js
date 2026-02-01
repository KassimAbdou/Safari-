import express from 'express';
import controller from '../controllers/geoController.js';
import pool from "../db.js";


const router = express.Router();

router.get('/islands', controller.listIslands);
router.get('/cities', controller.listCities);
router.get('/zones', controller.listZones);

export default router;