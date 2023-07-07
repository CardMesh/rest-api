import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import User from '../models/user.model.js';
import * as passwordService from './password.service.js';
import * as emailService from './email.service.js';
import { argon2Options } from '../configs/argon2.config.js';
import { loginDTO } from '../dto/auth.dto.js';
import { userDTO } from '../dto/user.dto.js';

export const login = async ({
  email,
  password,
}) => {
  const user = await User.findOne({ email: { $eq: email } });
  const loginError = 'A user with this combination of credentials was not found.';

  if (!user) {
    throw new Error(loginError);
  }

  const validPassword = await passwordService.comparePasswords(password, user.password);

  if (!validPassword) {
    throw new Error(loginError);
  }

  user.token = jwt.sign(
    {
      id: user.userId,
      role: user.role,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: +process.env.JWT_EXPIRATION_INTERVAL },
  );

  return loginDTO(user);
};

export const createUser = async (data) => {
  const {
    themeId,
    email,
    name,
    role,
    sendMail,
  } = data;

  const isEmailExist = await User.findOne({ email: { $eq: email } });
  if (isEmailExist) {
    throw new Error('Email already exists.');
  }

  const password = await passwordService.generatePassword(10);

  const hashedPassword = await passwordService.hashPassword(password);

  const user = await new User({
    themeId,
    name,
    email,
    password: hashedPassword,
    role,
    vCard: {
      person: {},
      professional: {},
      contact: {},
      location: {},
      socialMedia: {},
      avatar: {
        size: {},
        format: {},
      },
    },
  }).save();

  if (sendMail) {
    await emailService.sendRecoveryEmail(user.userId);
  }

  return userDTO(user);
};

export const resetPassword = async (data) => {
  const {
    email,
    token,
    password,
  } = data;

  const user = await User.findOne({ email: { $eq: email } });

  if (!user) {
    throw new Error('Email does not exist.');
  }

  // Check if the token has expired
  if (!user.resetPasswordExpires || Date.now() > user.resetPasswordExpires) {
    throw new Error('The token has expired.');
  }

  // Check if the provided token matches the stored hashed token
  const isTokenValid = await argon2.verify(user.resetPasswordToken, token);
  if (!isTokenValid) {
    throw new Error('The token is invalid.');
  }

  const hashedPassword = await argon2.hash(password, argon2Options);

  // Reset the token and expiry
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  // Update the user's password and save the user
  user.password = hashedPassword;
  await user.save();

  return userDTO(user);
};
