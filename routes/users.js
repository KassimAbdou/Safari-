import express from 'express';
import auth from '../middleware/auth.js';
import controller from '../controllers/userController.js';

const router = express.Router();

router.get('/me', auth, controller.getProfile);
router.put('/me', auth, controller.updateProfile);

export default router;