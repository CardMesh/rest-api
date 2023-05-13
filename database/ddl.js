import dotenv from 'dotenv';
import Theme from '../model/Theme.js';
import connectToDatabase from './connection.js';

dotenv.config();

const theme = {
  fontColor: '#000000',
  backgroundColor: '#FFFFFF',
  secondaryFontColor: '#FFFFFF',
  socialIconFontColor: '#FFFFFF',
  socialIconBackgroundColor: '#FFFFFF',
  btnFontColor: '#FFFFFF',
  btnBackgroundColor: '#FFFFFF',
  displayPhone: true,
  displaySms: true,
  displayEmail: true,
  displayWeb: true,
  displayAddress: true,
  displayMap: true,
  displayContactBtn: true,
  logoHeight: 10,
};

(async () => {
  try {
    await connectToDatabase();

    const ThemeCollection = Theme.collection;
    await ThemeCollection.drop();

    await new Theme(theme).save();

    console.log('Database setup completed.');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    process.exit(0);
  }
})();
