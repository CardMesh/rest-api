import { healthDTO } from '../dto/healthDTO.js';

export const checkHealth = async () => {
  const health = { message: 'Success' };

  return healthDTO(health);
};
