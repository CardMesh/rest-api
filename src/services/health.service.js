import { healthDTO } from '../dto/health.dto.js';

export const checkHealth = async () => {
  const health = { message: 'Success' };

  return healthDTO(health);
};
