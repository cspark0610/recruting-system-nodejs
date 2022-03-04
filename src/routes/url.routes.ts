import { Router } from 'express';

import * as urlController from '../controllers/url.controller';
import validateUrl from '../middlewares/validateUrl';
import validateUrlCreationParams from '../middlewares/validateUrlCreationParams';
import validateUrlDeletion from '../middlewares/validateUrlDeletion';

const router = Router();

router.get('/validate', validateUrl, urlController.renderApp);

router.get('/validate/error/not-valid', urlController.renderNotValidUrl);

router.get('/create', validateUrlCreationParams, urlController.generateUrl);

router.delete('/delete/:url_id', validateUrlDeletion, urlController.deleteUrl);

export default router;
