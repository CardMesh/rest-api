import dotenv from 'dotenv';
import Theme from '../model/Theme.js';
import connection from './connection.js';

dotenv.config();

connection();

const themes = [];

(async () => {
  try {
    await Theme.collection.drop();

    // eslint-disable-next-line no-restricted-syntax
    for (const theme of themes) {
      // eslint-disable-next-line no-await-in-loop
      await new Theme(theme).save();
    }
  } finally {
    process.exit(0);
  }
})();
