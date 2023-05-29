import { mkdir, unlink, writeFile } from 'fs/promises';
import { join, resolve } from 'path';
import vCard from 'vcf';

export const getCurrentTime = () => {
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

const createUploadsDirectory = async (uuid) => {
  const uploadsDirectory = resolve(`uploads/${uuid}`);
  await mkdir(uploadsDirectory, { recursive: true });
  return uploadsDirectory;
};

const deleteFile = async (filePath) => {
  try {
    await unlink(filePath);
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error(`Error deleting file: ${err}`);
    }
  }
};

export const generateVCard = (vCardOptions, version, uuid) => {
  const card = new vCard();

  card.set('fn', `${vCardOptions.professional.title} ${vCardOptions.name.firstName} ${vCardOptions.name.lastName}`);
  card.set('n', `${vCardOptions.name.lastName};${vCardOptions.name.firstName};${vCardOptions.name.middleName};${vCardOptions.professional.title};${vCardOptions.name.suffix}`);
  card.set('org', 'Example, Inc.'); // TODO
  card.set('title', vCardOptions.professional.title);
  card.set('email', vCardOptions.contact.email, version === 4 ? { type: 'work' } : undefined);
  card.set('url', vCardOptions.contact.web, version === 4 ? { type: 'work' } : undefined);
  card.set('rev', getCurrentTime());
  card.set('uid', `urn:uuid:${uuid}`);
  card.set('note', vCardOptions.professional.bio);
  card.set('tz', vCardOptions.location.timeZone);
  card.set('adr', `;;${vCardOptions.location.street}${vCardOptions.location.storey ? `, ${vCardOptions.location.storey}` : ''} ;${vCardOptions.location.city};${vCardOptions.location.state};${vCardOptions.location.postalCode};${vCardOptions.location.country}`, version === 4 ? { type: 'work' } : undefined);
  card.set('source', `/${uuid}/vcard${version}.vcf`); // TODO use absolute paths
  card.set('photo', `/${uuid}/profile.webp`, { type: 'webp' }); // TODO
  card.set('logo', '/logo.webp', { type: 'webp' }); // TODO
  card.set('geo', `geo:${vCardOptions.location.coordinates.latitude},${vCardOptions.location.coordinates.longitude}`);
  card.set('bday', vCardOptions.personal.birthday);
  card.set('kind', 'organization');
  card.set('tel', vCardOptions.contact.phone.number, version === 4 ? { type: 'work' } : undefined);
  if (version === 3) {
    card.set('profile', 'vcard');
  }

  return card.toString(version === 4 ? '4.0' : '3.0', 'UTF-8');
};

export const saveVCard = async (vCardOptions, uuid, version = 3) => {
  const uploadsDirectory = await createUploadsDirectory(`users/${uuid}`);

  const vcardPath = join(uploadsDirectory, `vcard${version}.vcf`);
  await deleteFile(vcardPath);

  const vCardData = generateVCard(vCardOptions, version, uuid);
  await writeFile(vcardPath, vCardData, { encoding: 'utf8' });
};

export default saveVCard; // todo refactor
