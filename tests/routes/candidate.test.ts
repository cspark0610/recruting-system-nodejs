import request from 'supertest';
import express, { Application } from 'express';
import * as candidateController from '../../src/controllers/candidate.controller';

const app: Application = express();

describe('GET /candidate', () => {
  test('Should return 200', () => {
    request(app).get('/candidate').expect(404);
  });

  test('Should return an error', async () => {
    const response = await request(app).get('/candidate').send();
  });
});
