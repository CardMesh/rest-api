import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Theme from '../model/Theme.js';
import User from '../model/User.js';
import connectToDatabase from './connection.js';

dotenv.config();

const theme = {
  fontColor: '#182d30',
  backgroundColor: '#dee1dd',
  secondaryFontColor: '#2f575d',
  socialIconFontColor: '#182d30',
  socialIconBackgroundColor: '#dee1dd',
  btnFontColor: '#dee1dd',
  btnBackgroundColor: '#182d30',
  displayPhone: true,
  displaySms: true,
  displayEmail: true,
  displayWeb: true,
  displayAddress: true,
  displayMap: true,
  displayContactBtn: true,
  logoHeight: 15,
};

const salt = await bcrypt.genSalt(+process.env.BCRYPT_SALT_ROUNDS);
const hashedPassword = await bcrypt.hash('Demodemo!', salt);

const user = {
  name: 'Test User',
  email: 'demo@demo.com',
  password: hashedPassword,
  settings: {
    theme: 'auto',
    language: 'en',
  },
  role: 'admin',
  vCardOptions: {
    name: {
      firstName: 'John',
      middleName: 'D',
      lastName: 'Doe',
      suffix: 'Jr',
    },
    professional: {
      title: 'Software Engineer',
      company: 'Example Company',
      role: 'Developer',
      bio: 'A software engineer with a passion for code.',
    },
    contact: {
      phone: {
        number: '1234567890',
        countryCode: '1',
        extension: '123',
      },
      email: 'john.doe@example.com',
      web: 'https://www.example.com',
    },
    location: {
      street: '123 Example Street',
      storey: '2nd Floor',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'USA',
      timeZone: 'Eastern Time (US & Canada)',
      coordinates: {
        latitude: 40.712776,
        longitude: -74.005974,
      },
    },
    socialMedia: {
      twitter: '',
      linkedin: '',
      facebook: '',
      instagram: '',
      pinterest: '',
      github: '',
    },
    personal: {
      birthday: '1990-01-01',
      pronouns: 'He/Him',
    },
  },
  statistics: {
    entryPoint: {
      qr: 0,
      nfc: 0,
      url: 0,
    },
  },
};

(async () => {
  try {
    await connectToDatabase();

    const ThemeCollection = Theme.collection;
    const UserCollection = User.collection;

    await ThemeCollection.drop();
    await UserCollection.drop(); // Drop the User collection if it exists

    await new Theme(theme).save();
    await new User(user).save(); // Save the new User

    console.log('Database setup completed.');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    process.exit(0);
  }
})();
