import express, { Express } from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { corsOptions, envConfig, swaggerDocs } from './config';
import errorMiddleware from './middlewares/error.middleware';
import createRoles from './lib/createRoles';
import routes from './routes/index.routes';

const app: Express = express();

if (envConfig.NODE_ENV === 'development') {
  const morgan = require('morgan');
  app.use(morgan('dev'));
}

app.use(express.urlencoded({ extended: true, limit: '25mb' }));
app.use(express.json({ limit: '25mb' }));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(helmet());

createRoles();
swaggerDocs(app, 3001);

app.use('/', routes);
app.use(errorMiddleware);

export default app;
