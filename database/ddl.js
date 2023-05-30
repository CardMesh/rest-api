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
  name: 'Mathias Reker',
  email: 'demo@demo.com',
  password: hashPassword('Demodemo!'),
  settings: {
    theme: 'dark',
  },
  role: 'admin',
  vCardOptions: {
    name: {
      firstName: 'Mathias',
      middleName: '',
      lastName: 'Reker',
      suffix: '',
    },
    professional: {
      title: '',
      company: 'KEA',
      role: 'Full-stack web developer',
      bio: 'I love IT Security. I believe in sharing knowledge, tools and value open source software development. 🚀',
    },
    contact: {
      phone: {
        number: '12345678',
        countryCode: '45',
        extension: '',
      },
      email: 'demo@demo.com',
      web: 'https://reker.dk',
    },
    location: {
      street: 'Rådhuspladsen',
      storey: '',
      city: 'København K',
      state: '',
      postalCode: '1599',
      country: 'Denmark',
      timeZone: 'Europe/Copenhagen',
      coordinates: {
        latitude: 55.6760441,
        longitude: 12.5687669,
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
      birthday: '1992-10-09',
      pronouns: 'He/Him',
    },
  },
};

const generateFakeUser = () => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = faker.internet.email();

  /**
   * Docs to fakerjs.
   *
   * https://next.fakerjs.dev/api/
   */
  return {
    name: `${firstName} ${lastName}`,
    email,
    password: hashPassword(faker.internet.password()),
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

    const users = Array.from({ length: 999 }, () => new User(generateFakeUser()));
    await User.insertMany(users);

    console.log('Database setup completed.');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    process.exit();
  }
})();
