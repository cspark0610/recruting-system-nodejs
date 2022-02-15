import { Router } from 'express';

import * as urlController from '../controllers/url.controller';
import validateUrl from '../middlewares/validateUrl'

const router = Router();

router.get('/validate', validateUrl, urlController.validateUrl);

router.get('/validate/error/not-valid', urlController.renderNotValidUrl);

router.post('/create', urlController.generateUrl);

export default router;
