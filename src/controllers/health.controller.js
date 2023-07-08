import { checkHealth } from '../services/health.service.js';

export const health = async (req, res) => {
  try {
    const healthStatus = await checkHealth();
    res.json(healthStatus);
  } catch (err) {
    res.status(500)
      .json({ errors: ['Internal Server Error.'] });
  }
};
