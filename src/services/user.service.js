import sanitize from 'mongo-sanitize';
import User from '../models/user.model.js';
import convertImage from '../utils/image.util.js';
import { userDTO, usersByPageLimitAndSearchQueryDTO, usersDTO } from '../dto/user.dto.js';
import { generateVCard } from '../utils/vcard.util.js';

export const updateUser = async (id, options) => {
  if (!options || typeof options !== 'object') {
    throw new Error('Invalid options provided.');
  }

  const sanitizedOptions = sanitize(options);

  const user = await User.findOneAndUpdate(
    { userId: { $eq: id } },
    sanitizedOptions,
    { new: true },
  )
    .exec();

  if (!user) {
    throw new Error('User not found.');
  }

  return userDTO(user);
};

export const addClickStatistics = async (id, source) => {
  await User.updateOne(
    { userId: { $eq: id } },
    { $push: { clicks: { source } } },
  );
};

export const getClickStatistics = async (id) => {
  const user = await User.findOne({ userId: { $eq: id } })
    .exec();

  if (!user) {
    throw new Error('User not found.');
  }

  const today = new Date();
  const clickCountsByDate = {};
  const totalClicksByType = {
    qr: 0,
    nfc: 0,
    web: 0,
  };

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(today);
    currentDate.setDate(currentDate.getDate() - i);
    const dateString = currentDate.toISOString()
      .split('T')[0];

    clickCountsByDate[dateString] = {
      qr: 0,
      nfc: 0,
      web: 0,
    };
  }

  user.clicks.forEach((click) => {
    const {
      source,
      timestamp,
    } = click;
    const clickDate = new Date(timestamp);
    clickDate.setUTCHours(0, 0, 0, 0);
    const dateString = clickDate.toISOString()
      .split('T')[0];

    if (dateString in clickCountsByDate) {
      clickCountsByDate[dateString][source]++;
    }

    totalClicksByType[source]++;
  });

  const totalClicks = user.clicks.length;

  return {
    clickCountsByDate,
    totalClicks,
    totalClicksByType,
  };
};

export const getUsersByPageLimitAndSearchQuery = async (page, limit, searchQuery) => {
  const skipDocs = (page - 1) * limit;
  const escapedSearchQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const searchPattern = new RegExp(escapedSearchQuery, 'i');
  const query = User.find()
    .select('email name role userId themeId')
    .skip(skipDocs)
    .limit(limit);
  const searchQueries = [
    { email: searchPattern },
    { name: searchPattern },
    { role: searchPattern },
  ];
  if (searchQuery) {
    query.or(searchQueries);
  }
  const users = await query;
  const totalUsers = await User.countDocuments({
    $or: searchQueries,
  });

  const totalPages = Math.ceil(totalUsers / limit);
  const nextPage = page < totalPages ? page + 1 : null;
  const prevPage = page > 1 ? page - 1 : null;

  return usersByPageLimitAndSearchQueryDTO(
    users,
    totalUsers,
    totalPages,
    nextPage,
    prevPage,
  );
};

export const updateUserSetting = async (id, theme) => {
  const sanitizedTheme = sanitize(theme);

  const updateField = { 'settings.theme': sanitizedTheme };

  const user = await User.findOneAndUpdate({ userId: { $eq: id } }, updateField)
    .exec();

  if (!user) {
    throw new Error('User not found.');
  }

  return user;
};

export const updateUserVCard = async (userId, vCardData) => {
  const sanitizedVCardData = sanitize(vCardData);

  const updateField = {
    'vCard.contact': sanitizedVCardData.contact,
    'vCard.location': sanitizedVCardData.location,
    'vCard.person': sanitizedVCardData.person,
    'vCard.professional': sanitizedVCardData.professional,
    'vCard.socialMedia': sanitizedVCardData.socialMedia,
  };

  const user = await User.findOneAndUpdate({ userId }, updateField, { new: true })
    .exec();

  if (!user) {
    throw new Error('User not found.');
  }

  return user;
};

export const getVCard = async (userId) => {
  const user = await User.findOne({ userId })
    .exec();

  if (!user) {
    throw new Error('User not found.');
  }

  return {
    ...user.vCard.toObject(),
    userId,
  };
};

export const getVcf = async (userId, version) => {
  const user = await User.findOne({ userId })
    .exec();

  if (!user) {
    throw new Error('User not found.');
  }

  const vCard = user.vCard.toObject();
  const filename = `${vCard.person.firstName}_${vCard.person.lastName}.vcf`;

  // Generate the VCF content based on the vCard and version
  const vcfContent = generateVCard(userId, vCard, version);

  return {
    filename,
    content: vcfContent,
  };
};

export const deleteUser = async (id) => {
  const user = await User.findOneAndDelete({ userId: { $eq: id } })
    .exec();

  if (!user) {
    throw new Error('User not found.');
  }
};

export const uploadImage = async (id, image, imageHeight) => {
  try {
    const {
      size,
      format,
    } = await convertImage(image, +imageHeight);

    const avatar = {
      'vCard.avatar.size': size,
      'vCard.avatar.format': format,
    };

    await User.findOneAndUpdate({ userId: id }, avatar)
      .exec();
  } catch (err) {
    throw new Error('Error uploading avatar.');
  }
};

export const getUsersByThemeId = async (themeId) => {
  const users = await User.find({ themeId })
    .exec();

  return usersDTO(users);
};
