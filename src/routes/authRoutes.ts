// routes/authRoutes.ts

import { Router } from 'express';
import { register, login, changePassword } from '../controllers/authController';
import { authMiddleware } from '../middlewares/authMiddleware'; // Import middleware

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/change-password/:userId', authMiddleware, changePassword); // Apply authMiddleware

export default router;
