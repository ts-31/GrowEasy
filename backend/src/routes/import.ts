import { Router } from 'express';
import { upload } from '../middleware/multerConfig';
import { importCsvController } from '../controllers/importController';

const router = Router();

// POST /api/import
router.post('/', upload.single('file'), importCsvController);

export default router;
