import jwt from 'jsonwebtoken';
import { createHash } from 'crypto';
import User from '../models/user.model.js';
import * as passwordService from './password.service.js';

export const login = async ({
  email,
  password,
}) => {
  const user = await User.findOne({ email });

  const loginError = 'A user with this combination of credentials was not found.';

  if (!user) {
    throw new Error(loginError);
  }

  const validPassword = await passwordService.comparePasswords(password, user.password);

  if (!validPassword) {
    throw new Error(loginError);
  }

  // create token
  const token = jwt.sign(
    {
      id: user.uuid,
      role: user.role,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: +process.env.JWT_EXPIRATION_INTERVAL },
  );

  return {
    name: user.name,
    email: user.email,
    uuid: user.uuid,
    token,
    createdAt: user._id.getTimestamp(),
    role: user.role,
    themeId: user.themeId,
  };
};

export const createUser = async (data) => {
  const {
    email,
    name,
    role,
  } = data;

  const isEmailExist = await User.findOne({ email });
  if (isEmailExist) {
    throw new Error('Email already exists');
  }

  // Generate random password
  const password = passwordService.generatePassword(10);

  // Hash the password
  const hashedPassword = await passwordService.hashPassword(password);

  const user = new User({
    name,
    email,
    password: hashedPassword,
    role,
    vCardOptions: {},
  });

  return user.save();
};

export const resetPassword = async (data) => {
  const {
    email,
    token,
    password,
  } = data;

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('Email does not exist');
  }

  const hashedToken = createHash('sha256')
    .update(user.password)
    .digest('hex');

  if (token !== hashedToken) {
    throw new Error('The token is invalid');
  }

  const hashedPassword = await passwordService.hashPassword(password);

  return User.findOneAndUpdate(
    { email: user.email },
    { password: hashedPassword },
    { new: true },
  );
};
