import assert from 'assert';
import { generateVCard } from '../util/vcard.js';

describe('generateVCard', () => {
  it('should generate a valid vCard v4', () => {
    const vCardOptions = {
      professional: {
        title: 'Software Engineer',
        bio: 'Experienced software engineer',
      },
      name: {
        firstName: 'John',
        lastName: 'Doe',
        middleName: '',
        suffix: '',
      },
      contact: {
        email: 'john.doe@example.com',
        web: 'www.example.com',
        phone: {
          number: '1234567890',
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
      personal: {
        birthday: '1990-01-01',
      },
    };
    const version = '4';
    const uuid = 'ac7171f3-9e6b-4099-9812-9ebad504bad5';

    const result = generateVCard(vCardOptions, version, uuid);

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
    assert.ok(result.includes('ADR;TYPE=work:;;123 Main Street ;City;State;12345;Country'));
    assert.ok(result.includes('SOURCE:/ac7171f3-9e6b-4099-9812-9ebad504bad5/profile.vcf'));
    assert.ok(result.includes('PHOTO;TYPE=webp:/ac7171f3-9e6b-4099-9812-9ebad504bad5/profile.webp'));
    assert.ok(result.includes('LOGO;TYPE=webp:/logo.webp'));
    assert.ok(result.includes('GEO:geo:40.7128,-74.006'));
    assert.ok(result.includes('BDAY:1990-01-01'));
    assert.ok(result.includes('KIND:organization'));
    assert.ok(result.includes('TEL;TYPE=work:1234567890'));
    assert.ok(!result.includes('PROFILE:vcard'));
  });
});

describe('generateVCard', () => {
  it('should generate a valid vCard v3', () => {
    const vCardOptions = {
      professional: {
        title: 'Software Engineer',
        bio: 'Experienced software engineer',
      },
      name: {
        firstName: 'John',
        lastName: 'Doe',
        middleName: '',
        suffix: '',
      },
      contact: {
        email: 'john.doe@example.com',
        web: 'www.example.com',
        phone: {
          number: '1234567890',
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
      personal: {
        birthday: '1990-01-01',
      },
    };
    const version = '3';
    const uuid = 'ac7171f3-9e6b-4099-9812-9ebad504bad5';

    const result = generateVCard(vCardOptions, version, uuid);

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
    assert.ok(result.includes('ADR:;;123 Main Street ;City;State;12345;Country'));
    assert.ok(result.includes('SOURCE:/ac7171f3-9e6b-4099-9812-9ebad504bad5/profile.vcf'));
    assert.ok(result.includes('PHOTO;TYPE=WEBP:/ac7171f3-9e6b-4099-9812-9ebad504bad5/profile.webp'));
    assert.ok(result.includes('LOGO;TYPE=WEBP:/logo.webp'));
    assert.ok(result.includes('GEO:geo:40.7128,-74.006'));
    assert.ok(result.includes('BDAY:1990-01-01'));
    assert.ok(result.includes('KIND:organization'));
    assert.ok(result.includes('TEL:1234567890'));
    assert.ok(result.includes('PROFILE:vcard'));
  });
});
