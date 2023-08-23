import { randomBytes } from 'crypto';
import argon2 from 'argon2';
import sendMail from '../utils/mail.util.js';
import User from '../models/user.model.js';
import { argon2Options } from '../configs/argon2.config.js';
import { createRecoveryEmailDTO } from '../dto/recovery.dto.js';

export const sendRecoveryEmail = async (userId) => {
  const user = await User.findOne({ userId: { $eq: userId } });

  if (!user) {
    throw new Error('User does not exist.');
  }

  // Generate a random 32-byte token
  const token = randomBytes(32)
    .toString('hex');

  // Hash the token and store it in the user record for later verification
  user.resetPasswordToken = await argon2.hash(token, argon2Options);

  // Set token expiry date
  user.resetPasswordExpires = Date.now() + 60 * 60 * +process.env.RESET_PASSWORD_EXPIRES_HOURS;
  await user.save();

  const resetLink = `${process.env.BASE_URL_FRONT}/reset?userId=${user.userId}&token=${token}&email=${user.email}`;

  const emailData = createRecoveryEmailDTO(user, resetLink);

  return sendMail(emailData.recipient, emailData.subject, emailData.content);
};
