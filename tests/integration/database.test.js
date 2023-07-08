import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connection from '../../src/data/connection.data.js';

dotenv.config();

beforeEach(async () => {
  await connection('mongodb://localhost:27017');
});

afterEach(async () => {
  await mongoose.connection.close();
});

describe('Test db', () => {
  it('should connect to mongodb', async () => {
    const dbStatus = mongoose.connection.readyState;
    expect(dbStatus)
      .toEqual(1);
  });
});
