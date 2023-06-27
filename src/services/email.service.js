import { readFileSync } from 'fs';
import mustache from 'mustache';
import mjml from 'mjml';
import { createHash } from 'crypto';
import sendMail from '../utils/mail.util.js';
import User from '../models/user.model.js';

export const sendRecoveryEmail = async (uuid) => {
  const user = await User.findOne({ uuid: { $eq: uuid } });

  if (!user) {
    throw new Error('User does not exist.');
  }

  const token = createHash('sha256')
    .update(user.password)
    .digest('hex');

  const resetLink = `${process.env.BASE_URL_FRONT}/reset?uuid=${user.uuid}&token=${token}&email=${user.email}`;

  const template = readFileSync('./src/templates/recovery.template.mjml', 'utf8');
  const mjmlContent = mustache.render(template, {
    name: user.name,
    resetLink,
  });
  const htmlOutput = mjml(mjmlContent).html;

  return sendMail(user.email, 'Reset password', htmlOutput);
};
