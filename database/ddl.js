import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';
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
  buttonText: 'Add to contacts',
  logoHeight: 15,
  themeId: 1,
};

const salt = await bcrypt.genSalt(+process.env.BCRYPT_SALT_ROUNDS);

const hashPassword = (password) => bcrypt.hashSync(password, salt);

const adminUser = {
  name: 'Test User',
  email: 'demo@demo.com',
  password: hashPassword('Demodemo!'),
  settings: {
    theme: 'dark',
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
      timeZone: 'Europe/Copenhagen',
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
};

const generateFakeUser = () => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = faker.internet.email();
  const hashedPassword = hashPassword(faker.internet.password());

  /**
   * Docs to fakerjs.
   *
   * https://next.fakerjs.dev/api/
   */
  return {
    name: `${firstName} ${lastName}`,
    email,
    password: hashedPassword,
    settings: {
      theme: 'dark',
    },
    role: 'user',
    vCardOptions: {
      name: {
        firstName,
        middleName: faker.person.middleName(),
        lastName,
        suffix: faker.person.suffix(),
      },
      professional: {
        title: faker.person.prefix(),
        company: faker.company.name(),
        role: faker.person.jobTitle(),
        bio: faker.lorem.sentences(),
      },
      contact: {
        phone: {
          number: faker.phone.number('## ## ## ##'),
          countryCode: '45',
          extension: faker.number.int({
            min: 100,
            max: 999,
          })
            .toString(),
        },
        email,
        web: faker.internet.url(),
      },
      location: {
        street: faker.location.streetAddress(),
        storey: faker.number.int({
          min: 1,
          max: 10,
        })
          .toString(),
        city: faker.location.city(),
        state: faker.location.state(),
        postalCode: faker.location.zipCode(),
        country: faker.location.country(),
        timeZone: faker.location.timeZone(),
        coordinates: {
          latitude: parseFloat(faker.location.latitude()),
          longitude: parseFloat(faker.location.longitude()),
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
        birthday: faker.date.past()
          .toISOString()
          .split('T')[0],
        pronouns: ['He/Him', 'She/Her', 'They/Them'][Math.floor(Math.random() * 3)],
      },
    },
  };
};

(async () => {
  try {
    await connectToDatabase();

    const ThemeCollection = Theme.collection;
    const UserCollection = User.collection;

    await ThemeCollection.drop();
    await UserCollection.drop(); // Drop the User collection if it exists

    await new Theme(theme).save();
    await new User(adminUser).save(); // Save the admin user

    const users = Array.from({ length: 100 }, () => new User(generateFakeUser()));
    await User.insertMany(users);

    console.log('Database setup completed.');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    process.exit(0);
  }
})();
