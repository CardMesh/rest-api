import * as authService from '../services/auth.service.js';
import * as emailService from '../services/email.service.js';

export const signup = async (req, res) => {
  try {
    const user = await authService.createUser(req.body);
    res.status(201)
      .json({ data: { user } });
  } catch (err) {
    res.status(400)
      .json({ errors: [err.message] });
  }
};

export const login = async (req, res) => {
  try {
    const user = await authService.login(req.body);
    res.header('Authorization', `Bearer ${user.token}`)
      .json({ data: user });
  } catch (err) {
    res.status(401)
      .json({ errors: [err.message] });
  }
};

export const recover = async (req, res) => {
  try {
    const mail = await emailService.sendRecoveryEmail(req.body.userId);
    res.json({ data: { mail } });
  } catch (err) {
    res.status(400)
      .json({ errors: [err.message] });
  }
};

export const reset = async (req, res) => {
  try {
    const user = await authService.resetPassword(req.body);
    res.json({ data: user });
  } catch (err) {
    res.status(400)
      .json({ errors: [err.message] });
  }
};
