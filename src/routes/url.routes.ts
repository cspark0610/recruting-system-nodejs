import { Router } from 'express';

import * as urlController from '../controllers/url.controller';
import validateUrl from '../middlewares/validateUrl';

const router = Router();

router.get('/validate', validateUrl, urlController.renderApp);

router.get('/validate/error/not-valid', urlController.renderNotValidUrl);

router.get('/create/:redirect_url', urlController.generateUrl);

export default router;
