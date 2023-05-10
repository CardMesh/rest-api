import dotenv from 'dotenv';
import Theme from '../model/Theme.js';
import connection from './connection.js';

dotenv.config();

connection();

try {
  const defaultTheme = new Theme({
    fontColor: 'blue',
    backgroundColor: 'white',
    displayMap: true,
  });

  defaultTheme.save();
} finally {
  process.exit(0);
}
