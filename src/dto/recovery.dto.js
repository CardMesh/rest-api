import { readFileSync } from 'fs';
import { join } from 'path';
import mustache from 'mustache';
import mjml from 'mjml';

const basePath = join(process.cwd(), 'src');

export const generateRecoveryEmailContent = (name, resetLink) => {
  const templatePath = join(basePath, 'templates', 'recovery.template.mjml');
  const template = readFileSync(templatePath, 'utf8');

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
