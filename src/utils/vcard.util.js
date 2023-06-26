import { mkdir, unlink, writeFile } from 'fs/promises';
import { join, resolve } from 'path';
import { readFileSync } from 'fs';

export const formatTimeUTC = (date) => {
  const year = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString()
    .padStart(2, '0');
  const day = date.getUTCDate()
    .toString()
    .padStart(2, '0');
  const hours = date.getUTCHours()
    .toString()
    .padStart(2, '0');
  const minutes = date.getUTCMinutes()
    .toString()
    .padStart(2, '0');
  const seconds = date.getUTCSeconds()
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
      console.error(`Error deleting file: ${err}.`);
    }
  }
};

export const generateVCard = (vCard, version, uuid) => {
  let workProp = '';
  let vCardVersion = '3.0';

  if (version === 4) {
    workProp = ';TYPE=work';
    vCardVersion = '4.0';
  }

  let avatarData;
  const avatarPath = `./uploads/users/${uuid}/avatar.png`;
  try {
    avatarData = readFileSync(avatarPath, { encoding: 'base64' });
  } catch (err) {
    avatarData = '';
  }

  let logoData;
  const logoPath = './uploads/themes/1/logo.png';
  try {
    logoData = readFileSync(logoPath, { encoding: 'base64' });
  } catch (err) {
    logoData = '';
  }

  const vCardName = vCard.person;
  const vCardProfessional = vCard.professional;
  const vCardLocation = vCard.location;
  const vCardContact = vCard.contact;
  const vCardPersonal = vCard.personal;

  const {
    title,
    company,
    bio,
  } = vCardProfessional;

  const {
    firstName,
    lastName,
    middleName,
    suffix,
  } = vCardName;

  const {
    email,
    web,
    phone,
  } = vCardContact;

  const {
    countryCode,
    number,
  } = phone;

  const {
    street,
    storey,
    city,
    state,
    postalCode,
    country,
    coordinates,
    timeZone,
  } = vCardLocation;

  return `BEGIN:VCARD
VERSION:${vCardVersion}
FN:${title} ${firstName} ${lastName}
N:${lastName};${firstName};${middleName};${title};${suffix}
ORG:${company}
TITLE:${title}
EMAIL${workProp}:${email}
URL${workProp}:${web}
REV:${formatTimeUTC(new Date())}
UID:urn:uuid:${uuid}
NOTE:${bio}
TZ:${timeZone}
ADR${workProp}:;;${street}${storey ? `, ${storey}` : ''};${city};${state};${postalCode};${country}
PHOTO;${version === 3 ? `TYPE=PNG;ENCODING=b:${avatarData}` : `ENCODING=BASE64;TYPE=PNG:${avatarData}`}
LOGO;${version === 3 ? `TYPE=PNG;ENCODING=b:${logoData}` : `ENCODING=BASE64;TYPE=PNG:${logoData}`}
GEO:geo:${coordinates.latitude},${coordinates.longitude}
BDAY:${vCardPersonal.birthday}
KIND:organization
TEL${workProp}:+${countryCode}${number}
${version === 3 ? 'PROFILE:vcard' : ''}
END:VCARD`;
};

export const saveVCard = async (vCard, uuid, version = 3) => {
  const uploadsDirectory = await createUploadsDirectory(`users/${uuid}`);

  const vcardPath = join(uploadsDirectory, `vcard${version}.vcf`);
  await deleteFile(vcardPath);

  const vCardData = generateVCard(vCard, version, uuid);
  await writeFile(vcardPath, vCardData, { encoding: 'utf8' });
};

export default saveVCard;
