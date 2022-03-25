import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import corsOptions from './config/cors';
import envConfig from './config/env';
import errorMiddleware from './middlewares/error.middleware';
import createRoles from './lib/createRoles';
import routes from './routes/index.routes';

const app: Application = express();

if (envConfig.NODE_ENV === 'development') {
  const morgan = require('morgan');
  app.use(morgan('dev'));
}

app.use(express.urlencoded({ extended: true, limit: '25mb' }));
app.use(express.json({ limit: '25mb' }));
app.use(cors(corsOptions));
app.use(helmet());

createRoles();

app.use('/', routes);
app.use(errorMiddleware);

export default app;
