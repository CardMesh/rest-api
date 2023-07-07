import { readFileSync } from 'fs';
import mustache from 'mustache';
import mjml from 'mjml';

export const generateRecoveryEmailContent = (name, resetLink) => {
  const template = readFileSync('./src/templates/recovery.template.mjml', 'utf8');
  const mjmlContent = mustache.render(template, {
    name,
    resetLink,
  });

  return mjml(mjmlContent).html;
};

export const createRecoveryEmailDTO = (user, resetLink) => {
  const recipient = user.email;
  const subject = 'Reset password';
  const content = generateRecoveryEmailContent(user.name, resetLink);

  return {
    recipient,
    subject,
    content,
  };
};
