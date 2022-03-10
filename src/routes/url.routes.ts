import { Router } from 'express';

import * as urlController from '../controllers/url.controller';

import validateUniqueUrl from '../middlewares/validators/validateUniqueUrl';
import validateUniqueUrlCreationParams from '../middlewares/validators/validateUniqueUrlCreationParams';

import urlCreation from '../middlewares/requests/urlCreation';

const router = Router();

router.get('/validate', validateUniqueUrl, urlController.renderApp);
router.get('/validate/error/not-valid', urlController.renderNotValidUrl);
router.get('/create', urlController.generateUniqueUrl);

// router.delete(
// '/delete/:url_id',
// validateUniqueUrlDeletion,
// urlController.deleteUrl,
// );

export default router;
