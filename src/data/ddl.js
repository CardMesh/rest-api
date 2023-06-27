import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import readline from 'readline';
import Theme from '../models/theme.model.js';
import User from '../models/user.model.js';
import connection from './connection.js';
import * as userService from '../services/user.service.js';

dotenv.config();

const promptUser = (question) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(`\x1b[36m${question}\x1b[0m `, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
};

const adminUser = async (inputName, inputPassword, inputEmail) => {
  const salt = await bcrypt.genSalt(+process.env.BCRYPT_SALT_ROUNDS);

  return {
    name: inputName,
    email: inputEmail,
    password: bcrypt.hashSync(inputPassword, salt),
    role: 'admin',
    vCard: {
      person: {},
      professional: {},
      contact: {},
      location: {},
      socialMedia: {},
    },
  };
};

async function installUser() {
  console.log('\n\x1b[1mCreate admin user:\x1b[0m');
  const username = await promptUser('\tEnter name:');
  const email = await promptUser('\tEnter e-mail:');
  const password = await promptUser('\tEnter password:');

  console.log('\n\x1b[32mUser installation complete!\x1b[0m');

  const newUser = await new User(await adminUser(username, password, email)).save();
  await userService.saveUserVCard(newUser.vCard, newUser.uuid);
}

async function installTheme() {
  const theme = {
    themeId: 1,
    display: {},
  };

  await new Theme(theme).save();
  console.log('\n\x1b[32mTheme setup complete!\x1b[0m');
}

(async () => {
  try {
    await connection(process.env.DB_CONNECTION);

    await Promise.all([
      Theme.collection.drop(),
      User.collection.drop(),
    ]);

    await installTheme();
    await installUser();

    console.log('\n\x1b[32mDatabase setup completed.\x1b[0m');
  } catch (err) {
    console.error('\n\x1b[31mError setting up database:', err, '\x1b[0m');
  } finally {
    process.exit();
  }
})();
