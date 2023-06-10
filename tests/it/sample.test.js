import dotenv from 'dotenv';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app.js';
import connection from '../../src/data/connection.js';

dotenv.config();

beforeEach(async () => {
  await connection('mongodb://localhost:27017');
});

afterEach(async () => {
  // await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('Get healthcheck', () => {
  it('should call the health check', async () => {
    const res = await request(app)
      .get('/api/health');
    expect(res.statusCode)
      .toEqual(200);
  });
});

describe('Test db', () => {
  it('should connect to mongodb', async () => {
    const dbStatus = mongoose.connection.readyState;
    expect(dbStatus)
      .toEqual(1);
  });
});
