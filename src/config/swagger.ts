import { Express, Request, Response } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import envConfig from './env';

const { NODE_ENV } = envConfig;

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'WorkAt API',
      version: '1.0.0',
      description: 'API for the WorkAt application',
    },
    servers: [
      {
        url:
          NODE_ENV === 'development'
            ? `http://localhost:3001`
            : 'https://workat.com',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.routes.ts', './src/db/schemas/*.schema.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app: Express, port: number) {
  app.get('/api-docs.json', (_req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  const docsUrl =
    NODE_ENV === 'development'
      ? `http://localhost:${port}/api-docs`
      : 'https://fulltimeforce-video-interview.herokuapp.com/api-docs';

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  console.log(`Swagger docs available at ${docsUrl}`);
}

export default swaggerDocs;
