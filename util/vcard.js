import path from 'path';
import { promises as fs } from 'fs';
import vCard from 'vcf';

const getCurrentTime = () => {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = (now.getUTCMonth() + 1).toString()
    .padStart(2, '0');
  const day = now.getUTCDate()
    .toString()
    .padStart(2, '0');
  const hours = now.getUTCHours()
    .toString()
    .padStart(2, '0');
  const minutes = now.getUTCMinutes()
    .toString()
    .padStart(2, '0');
  const seconds = now.getUTCSeconds()
    .toString()
    .padStart(2, '0');
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
};

const saveVCard = async (vCardOptions, uuid, version = '3') => {
  const uploadsDirectory = path.resolve(`uploads/${uuid}`);
  await fs.mkdir(uploadsDirectory, { recursive: true });

  const vcardPath = path.join(uploadsDirectory, `profile${version}.vcf`);
  try {
    await fs.unlink(vcardPath);
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error(`Error deleting file: ${err}`);
    }
  }

  const card = new vCard();

  card.set('fn', `${vCardOptions.title} ${vCardOptions.firstName} ${vCardOptions.lastName}`);
  card.set('n', `${vCardOptions.lastName};${vCardOptions.firstName};${vCardOptions.middleName};${vCardOptions.title};${vCardOptions.suffix}`);
  card.set('org', 'Example, Inc.'); // TODO
  card.set('title', vCardOptions.title);
  card.set('email', vCardOptions.email, version === '4' ? { type: 'work' } : undefined);
  card.set('url', vCardOptions.web, version === '4' ? { type: 'work' } : undefined);
  card.set('rev', getCurrentTime());
  card.set('uid', `urn:uuid:${uuid}`);
  card.set('note', vCardOptions.bio);
  card.set('tz', vCardOptions.timeZone);
  card.set('adr', `;;${vCardOptions.street}${vCardOptions.storey ? `, ${vCardOptions.storey}` : ''} ;${vCardOptions.city};${vCardOptions.state};${vCardOptions.postalCode};${vCardOptions.country}`, version === '4' ? { type: 'work' } : undefined);
  card.set('source', `/${uuid}/profile.vcf`);
  card.set('photo', `/${uuid}/profile.webp`, { type: 'webp' }); // TODO
  card.set('logo', '/logo.webp', { type: 'webp' }); // TODO
  card.set('geo', `geo:${vCardOptions.latitude},${vCardOptions.longitude}`);
  card.set('bday', vCardOptions.birthday);
  card.set('kind', 'organization');
  card.set('tel', vCardOptions.phone, version === '4' ? { type: 'work' } : undefined);
  if (version === '3') {
    card.set('profile', 'vcard');
  }

  await fs.writeFile(vcardPath, card.toString(version === 4 ? '4.0' : '3.0', 'UTF-8'), { encoding: 'utf8' });
};

export default saveVCard;

/**

 import path from 'path';
 import { promises as fs } from 'fs';
 import vCard from 'vcf';

 const getCurrentTime = () => new Date().toISOString().replace(/[-:.]/g, '');

 const createVCard = (vCardOptions, uuid, version = '3') => {
  const card = new vCard();

  const params = version === '4' ? { type: 'work' } : undefined;

  card.set('fn', `${vCardOptions.title} ${vCardOptions.firstName} ${vCardOptions.lastName}`);
  card.set('n', `${vCardOptions.lastName};${vCardOptions.firstName};${vCardOptions.middleName};${vCardOptions.title};${vCardOptions.suffix}`);
  card.set('org', 'Example, Inc.'); // TODO
  card.set('title', vCardOptions.title);
  card.set('email', vCardOptions.email, params);
  card.set('url', vCardOptions.web, params);
  card.set('rev', getCurrentTime());
  card.set('uid', `urn:uuid:${uuid}`);
  card.set('note', vCardOptions.bio);
  card.set('tz', vCardOptions.timeZone);
  card.set('adr', `;;${vCardOptions.street};${vCardOptions.city};${vCardOptions.state};${vCardOptions.postalCode};${vCardOptions.country}`, params);
  card.set('source', `/${uuid}/profile.vcf`);
  card.set('photo', `/${uuid}/profile.webp`, { type: 'webp' }); // TODO
  card.set('logo', '/logo.webp', { type: 'webp' }); // TODO
  card.set('geo', `geo:${vCardOptions.latitude},${vCardOptions.longitude}`);
  card.set('bday', vCardOptions.birthday);
  card.set('kind', 'organization');
  card.set('tel', vCardOptions.phone, params);
  if (version === '3') {
    card.set('profile', 'vcard');
  }

  return card;
};

 const saveVCard = async (vCardOptions, uuid, version = '3') => {
  const uploadsDirectory = path.resolve(`uploads/${uuid}`);
  await fs.mkdir(uploadsDirectory, { recursive: true });

  const vcardPath = path.join(uploadsDirectory, `profile${version}.vcf`);
  await fs.unlink(vcardPath);

  const card = createVCard(vCardOptions, uuid, version);

  await fs.writeFile(vcardPath, card.toString(version === '4' ? '4.0' : '3.0', 'utf-8'), { encoding: 'utf8' });
};

 export default saveVCard;


 */