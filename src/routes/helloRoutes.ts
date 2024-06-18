// src/routes/helloRoutes.ts
import express from 'express';
import { sayHello, sayHelloToName } from '../controllers/helloController';

const router = express.Router();

router.get('/', sayHello);
router.get('/:name', sayHelloToName);

export default router;
