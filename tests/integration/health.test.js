import request from 'supertest';
import app from '../../app.js';
import { apiOptions } from '../../src/configs/api.config.js';

describe('Get healthcheck', () => {
  it('should call the health check', async () => {
    const res = await request(app)
      .get(`${apiOptions.prefix}/health`);
    expect(res.statusCode)
      .toEqual(200);
  });
});
