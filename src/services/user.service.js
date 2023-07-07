import sanitize from 'mongo-sanitize';
import User from '../models/user.model.js';
import convertImage from '../utils/image.util.js';
import { userDTO, usersByPageLimitAndSearchQueryDTO, usersDTO } from '../dto/user.dto.js';

export const getUserByIdAndUpdate = async (id, options) => {
  if (!options || typeof options !== 'object') {
    throw new Error('Invalid options provided.');
  }

  const sanitizedOptions = sanitize(options);

  return User.findOneAndUpdate(
    { userId: { $eq: id } },
    sanitizedOptions,
    { new: true },
  )
    .exec();
};

export const getUserById = async (id) => User.findOne({ userId: { $eq: id } })
  .exec();

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

export const deleteUserById = async (id) => {
  const user = await User.findOneAndDelete({ userId: { $eq: id } })
    .exec();

  if (!user) {
    throw new Error('User not found.');
  }

  return userDTO(user);
};

export const uploadAvatarById = async (id, image, imageHeight) => {
  try {
    const {
      size,
      format,
    } = await convertImage(image, +imageHeight);

    const avatar = {
      'vCard.avatar.size': size,
      'vCard.avatar.format': format,
    };

    return await User.findOneAndUpdate({ userId: id }, avatar, { new: true })
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
