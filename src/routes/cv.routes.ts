import { Router } from 'express';
import getCV from '../controllers/cv.controller';

const router = Router();

router.get('/get/:key', getCV);

export default router;
