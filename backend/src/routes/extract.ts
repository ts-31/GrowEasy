import { Router } from 'express';
import { extractController } from '../controllers/extractController';

const router = Router();

// POST /api/extract
router.post('/', extractController);

export default router;
