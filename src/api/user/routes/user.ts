// routes/authRoutes.ts

import { Router } from 'express';
import { register, login, changePassword } from '../controllers/user';
import { authenticate } from '../../../middlewares/authenticate';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/change-password/:userId', authenticate, changePassword);

export default router;
