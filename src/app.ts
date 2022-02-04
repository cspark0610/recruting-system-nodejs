import { Application } from 'express';

import express from 'express';
import path from 'path';
import cors from 'cors';

import routes from './routes/index.route';
//import setHeaders from './middlewares/setHeaders';

const app: Application = express();

app.use(express.urlencoded({ extended: true, limit: '25mb' }));
app.use(express.json({ limit: '25mb' }));
app.use(express.static(path.join(__dirname, './public')));
//app.use(cors);

app.use('/', routes);

export default app;
