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

const saveVCard = async (vCardOptions, uuid) => {
  const uploadsDirectory = path.resolve(`uploads/${uuid}`);
  await fs.mkdir(uploadsDirectory, { recursive: true });

  const vcardPath = path.join(uploadsDirectory, 'profile.vcf');
  try {
    await fs.unlink(vcardPath);
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error(`Error deleting file: ${err}`);
    }
  }

  const card = new vCard();

  card.set('version', '4.0');
  card.set('fn', `${vCardOptions.title} ${vCardOptions.firstName} ${vCardOptions.lastName}`);
  card.set('n', `${vCardOptions.lastName};${vCardOptions.firstName};${vCardOptions.middleName};${vCardOptions.title};${vCardOptions.suffix}`);
  card.set('org', 'Example, Inc.'); // TODO
  card.set('title', vCardOptions.title);
  card.set('email', vCardOptions.email);
  card.set('url', vCardOptions.web, { type: 'work' });
  card.set('rev', getCurrentTime());
  card.set('uid', `urn:uuid:${uuid}`);
  card.set('note', vCardOptions.bio);
  card.set('lang', vCardOptions.language);
  card.set('tz', vCardOptions.timeZone);
  card.set('gender', vCardOptions.gender);
  card.add('x-socialprofile', 'https://twitter.com/johndoe', { type: 'twitter' }); // TODO
  card.add('x-socialprofile', 'https://facebook.com/johndoe', { type: 'facebook' }); // TODO
  card.add('x-socialprofile', 'https://linkedin.com/in/johndoe', { type: 'linkedin' }); // TODO
  card.set('tel', vCardOptions.phone, { type: 'work' });
  card.set('adr', `;;${vCardOptions.street};${vCardOptions.city};${vCardOptions.state};${vCardOptions.postalCode};${vCardOptions.country}`, { type: 'work' });
  card.set('source', `/${uuid}/profile.vcf`);
  card.set('photo', `/${uuid}/profile.webp`, { mediatype: 'image/webp' }); // TODO
  card.set('logo', '/logo.webp', { mediatype: 'image/webp' }); // TODO
  card.set('geo', `geo:${vCardOptions.latitude},${vCardOptions.longitude}`);
  card.set('bday', vCardOptions.birthday);
  card.set('kind', 'organization');

  await fs.writeFile(vcardPath, card.toString());
};

export default saveVCard;
