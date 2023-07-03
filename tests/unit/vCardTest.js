import assert from 'assert';
import { generateVCard } from '../../src/utils/vcard.util.js';

const vCard = {
  professional: {
    title: 'Software Engineer',
    bio: 'Experienced software engineer',
    company: 'Example, Inc.',
  },
  person: {
    firstName: 'John',
    lastName: 'Doe',
    middleName: '',
    suffix: '',
    birthday: '1990-01-01',
  },
  contact: {
    email: 'john.doe@example.com',
    web: 'www.example.com',
    phone: {
      countryCode: '45',
      number: '12345678',
    },
  },
  location: {
    timeZone: 'UTC',
    street: '123 Main Street',
    storey: '',
    city: 'City',
    state: 'State',
    postalCode: '12345',
    country: 'Country',
    coordinates: {
      latitude: 40.7128,
      longitude: -74.0060,
    },
  },
  avatar: {
    format: {
      png: 'x',
      webp: 'y',
    },
    size: {
      height: 130,
      width: 130,
    },
  },
};

const theme = {
  logo: {
    format: {
      png: 'x',
      webp: 'y',
    },
    size: {
      height: 50,
      width: 20,
    },
  },
};

describe('Generate vCard 3.0', () => {
  it('should generate a valid vCard 3.0', () => {
    const version = 3;
    const userId = 'ac7171f3-9e6b-4099-9812-9ebad504bad5';

    const result = generateVCard(userId, vCard, theme, version);

    assert.ok(result.includes('FN:Software Engineer John Doe'));
    assert.ok(result.includes('N:Doe;John;;Software Engineer;'));
    assert.ok(result.includes('ORG:Example, Inc.'));
    assert.ok(result.includes('TITLE:Software Engineer'));
    assert.ok(result.includes('EMAIL:john.doe@example.com'));
    assert.ok(result.includes('URL:www.example.com'));
    assert.ok(result.includes('REV:'));
    assert.ok(result.includes('UID:urn:uuid:ac7171f3-9e6b-4099-9812-9ebad504bad5'));
    assert.ok(result.includes('NOTE:Experienced software engineer'));
    assert.ok(result.includes('TZ:UTC'));
    assert.ok(result.includes('ADR:;;123 Main Street;City;State;12345;Country'));
    assert.ok(result.includes('GEO:geo:40.7128,-74.006'));
    assert.ok(result.includes('BDAY:1990-01-01'));
    assert.ok(result.includes('KIND:organization'));
    assert.ok(result.includes('TEL:+4512345678'));
    assert.ok(result.includes('PROFILE:vcard'));
  });
});

describe('Generate vCard 4.0', () => {
  it('should generate a valid vCard 4.0', () => {
    const version = 4;
    const userId = 'ac7171f3-9e6b-4099-9812-9ebad504bad5';

    const result = generateVCard(userId, vCard, theme, version);

    assert.ok(result.includes('FN:Software Engineer John Doe'));
    assert.ok(result.includes('N:Doe;John;;Software Engineer;'));
    assert.ok(result.includes('ORG:Example, Inc.'));
    assert.ok(result.includes('TITLE:Software Engineer'));
    assert.ok(result.includes('EMAIL;TYPE=work:john.doe@example.com'));
    assert.ok(result.includes('URL;TYPE=work:www.example.com'));
    assert.ok(result.includes('REV:'));
    assert.ok(result.includes('UID:urn:uuid:ac7171f3-9e6b-4099-9812-9ebad504bad5'));
    assert.ok(result.includes('NOTE:Experienced software engineer'));
    assert.ok(result.includes('TZ:UTC'));
    assert.ok(result.includes('ADR;TYPE=work:;;123 Main Street;City;State;12345;Country'));
    assert.ok(result.includes('GEO:geo:40.7128,-74.006'));
    assert.ok(result.includes('BDAY:1990-01-01'));
    assert.ok(result.includes('KIND:organization'));
    assert.ok(result.includes('TEL;TYPE=work:+4512345678'));
    assert.ok(!result.includes('PROFILE:vcard'));
  });
});
