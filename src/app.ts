import { Application } from 'express';

import express from 'express';
import path from 'path';
import morgan from 'morgan';

import routes from './routes/index.route';
import setHeaders from './middlewares/setHeaders';

const app: Application = express();

app.use(express.urlencoded({ extended: true, limit: '25mb' }));
app.use(express.json({ limit: '25mb' }));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '../public')));
app.use(setHeaders);

app.use('/', routes);

export default app;
