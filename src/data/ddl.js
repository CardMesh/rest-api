import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';
import Theme from '../models/theme.model.js';
import User from '../models/user.model.js';
import connection from './connection.js';

dotenv.config();

const theme = {
  themeId: 1,
  color: {
    font: {
      primary: '#182d30',
      secondary: '#2f575d',
    },
    background: '#dee1dd',
    socialIcons: {
      font: '#182d30',
      background: '#dee1dd',
    },
    vCardBtn: {
      font: '#dee1dd',
      background: '#182d30',
    },
  },
  display: {
    phone: true,
    sms: true,
    email: true,
    web: true,
    address: true,
    map: true,
    vCardBtn: true,
  },
  logo: {
    height: 15,
  },
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
  vCard: {
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
      linkedin: 'https://www.linkedin.com/in/mathiasreker/',
      facebook: '',
      instagram: '',
      pinterest: '',
      github: 'https://github.com/MathiasReker',
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
    vCard: {
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
    await connection(process.env.DB_CONNECTION);

    const ThemeCollection = Theme.collection;
    const UserCollection = User.collection;

    await ThemeCollection.drop();
    await UserCollection.drop();

    await new Theme(theme).save();
    await new User(adminUser).save();

    let users = Array.from({ length: 10 }, generateFakeUser);
    users = await Promise.all(users.map(async (user) => new User(user)));
    await User.insertMany(users);

    console.log('Database setup completed.');
  } catch (err) {
    console.error('Error setting up database:', err);
  } finally {
    process.exit();
  }
})();
