import { checkHealth } from '../services/health.service.js';

export const health = async (req, res) => {
  try {
    const healthStatus = await checkHealth();
    res.send(healthStatus);
  } catch (err) {
    res.status(500)
      .send('Internal Server Error.');
  }
};
