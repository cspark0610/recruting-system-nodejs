import { Router } from 'express';

import {
  getUrls,
  getUniqueUrl,
  generateUrl,
} from '../controllers/url.controller';

const router = Router();

router.get('/get', getUrls);

router.get('/validate', getUniqueUrl);

router.post('/create', generateUrl);

export default router;
