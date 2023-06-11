import request from 'supertest';
import app from '../../app.js';

describe('Get healthcheck', () => {
  it('should call the health check', async () => {
    const res = await request(app)
      .get('/api/health');
    expect(res.statusCode)
      .toEqual(200);
  });
});
