import { Router } from 'express';

import * as urlController from '../controllers/url.controller';

const router = Router();

router.get('/validate', urlController.validateUrl);

router.get('/validate/error/not-valid', urlController.renderNotValidUrl);

router.post('/create', urlController.generateUrl);

export default router;
