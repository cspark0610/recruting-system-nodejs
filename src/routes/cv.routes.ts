import { Router } from 'express';
import multer from 'multer';
import storage from '../lib/multerConfig';
import * as cvController from '../controllers/cv.controller';

const router = Router();

const upload = multer({ storage });

router.get('/get/:key', cvController.getCV);
router.post('/upload', upload.single('cv'), cvController.uploadCV);

export default router;
