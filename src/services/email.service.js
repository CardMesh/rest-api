import { readFileSync } from 'fs';
import mustache from 'mustache';
import mjml from 'mjml';
import { randomBytes } from 'crypto';
import argon2 from 'argon2';
import sendMail from '../utils/mail.util.js';
import User from '../models/user.model.js';
import { argon2Options } from '../configs/argon2.config.js';

export const sendRecoveryEmail = async (uuid) => {
  const user = await User.findOne({ uuid: { $eq: uuid } });

  if (!user) {
    throw new Error('User does not exist.');
  }

  // Generate a random 32-byte token
  const token = randomBytes(32)
    .toString('hex');

  // Hash the token and store it in the user record for later verification
  user.resetPasswordToken = await argon2.hash(token, argon2Options);

  // Set token expiry date to 1 hour from now
  user.resetPasswordExpires = Date.now() + (60 * 60 * +process.env.RESET_PASSWORD_EXPIRES_HOURS);

  await user.save();

  const resetLink = `${process.env.BASE_URL_FRONT}/reset?uuid=${user.uuid}&token=${token}&email=${user.email}`;

  const template = readFileSync('./src/templates/recovery.template.mjml', 'utf8');
  const mjmlContent = mustache.render(template, {
    name: user.name,
    resetLink,
  });
  const htmlOutput = mjml(mjmlContent).html;

  return sendMail(user.email, 'Reset password', htmlOutput);
};
