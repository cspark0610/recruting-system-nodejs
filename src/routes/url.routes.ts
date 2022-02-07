import { Router } from 'express';

import {
  getUrls,
  getUniqueUrl,
  generateUrl,
  renderNotValidUrl,
} from '../controllers/url.controller';

const router = Router();

router.get('/get', getUrls);

router.get('/validate', getUniqueUrl);

router.get('/validate/error/not-valid', renderNotValidUrl);

router.post('/create', generateUrl);

export default router;
