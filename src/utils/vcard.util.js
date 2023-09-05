import sanitizeHtml from 'sanitize-html';

const padStartTwo = (num) => num.toString().padStart(2, '0');

export const formatTimeUTC = (date) => `${date.getUTCFullYear()}${padStartTwo(date.getUTCMonth() + 1)}${padStartTwo(date.getUTCDate())}T${padStartTwo(date.getUTCHours())}${padStartTwo(date.getUTCMinutes())}${padStartTwo(date.getUTCSeconds())}Z`;

export const generateVCard = (userId, vCard, theme, version = 3) => {
  const workProp = version === 4 ? ';TYPE=work' : '';

  const sanitizedBio = sanitizeHtml(vCard.professional.bio);

  const cleanBio = sanitizedBio.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ');

  let vCardString = `BEGIN:VCARD
VERSION:${version === 4 ? '4.0' : '3.0'}
FN:${vCard.professional.title} ${vCard.person.firstName} ${vCard.person.lastName}
N:${vCard.person.lastName};${vCard.person.firstName};${vCard.person.middleName};${vCard.professional.title};${vCard.person.suffix}
ORG:${vCard.professional.company}
TITLE:${vCard.professional.title}
EMAIL${workProp}:${vCard.contact.email}
URL${workProp}:${vCard.contact.web}
REV:${formatTimeUTC(new Date())}
UID:urn:uuid:${userId}
NOTE:${cleanBio}
TZ:${vCard.location.timeZone}
ADR${workProp}:;;${vCard.location.street}${vCard.location.storey ? `, ${vCard.location.storey}` : ''};${vCard.location.city};${vCard.location.state};${vCard.location.postalCode};${vCard.location.country}
GEO:geo:${vCard.location.coordinates.latitude},${vCard.location.coordinates.longitude}
BDAY:${vCard.person.birthday}
KIND:organization
TEL${workProp}:${vCard.contact.phone.countryCode ? `+${vCard.contact.phone.countryCode}${vCard.contact.phone.number}` : ''}
${version === 3 ? 'PROFILE:vcard' : ''}`;

  if (vCard?.avatar?.format?.png) {
    vCardString += `\nPHOTO;${version === 3 ? `TYPE=PNG;ENCODING=b:${vCard.avatar.format.png}` : `ENCODING=BASE64;TYPE=PNG:${vCard.avatar.format.png}`}`;
  }

  if (vCard?.logo?.format?.png) {
    vCardString += `\nLOGO;${version === 3 ? `TYPE=PNG;ENCODING=b:${vCard.logo.format.png}` : `ENCODING=BASE64;TYPE=PNG:${vCard.logo.format.png}`}`;
  }

  vCardString += '\nEND:VCARD';

  return vCardString;
};
