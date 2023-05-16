import mongoose from 'mongoose';
import { randomUUID } from 'crypto';

const vCardOptionsSchema = new mongoose.Schema({
  name: {
    firstName: { type: String, default: '' },
    middleName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    suffix: { type: String, default: '' },
  },
  professional: {
    title: { type: String, default: '' },
    company: { type: String, default: '' },
    role: { type: String, default: '' },
    bio: { type: String, default: '' },
  },
  contact: {
    phone: {
      number: { type: String, default: '' },
      countryCode: { type: String, default: '' },
      extension: { type: String, default: '' },
    },
    email: { type: String, default: '' },
    web: { type: String, default: '' },
  },
  location: {
    street: { type: String, default: '' },
    storey: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    postalCode: { type: String, default: '' },
    country: { type: String, default: '' },
    timeZone: { type: String, default: '' },
    coordinates: {
      latitude: { type: Number, default: 0 },
      longitude: { type: Number, default: 0 },
    },
  },
  socialMedia: {
    twitter: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    pinterest: { type: String, default: '' },
    github: { type: String, default: '' },
  },
  personal: {
    birthday: { type: String, default: '' },
    pronouns: { type: String, default: '' },
  },
});

// Define main schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
    maxlength: 255,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minlength: 6,
    maxlength: 255,
    index: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  statistics: {
    entryPoint: {
      qr: {
        type: Number,
        default: 0,
      },
      nfc: {
        type: Number,
        default: 0,
      },
      url: {
        type: Number,
        default: 0,
      },
    }, // use sub-schema as property
  },
  vCardOptions: vCardOptionsSchema, // use sub-schema as property
  settings: {
    theme: {
      type: String,
      required: true,
      default: 'auto',
    },
    language: {
      type: String,
      required: true,
      default: 'en',
    },
  },
  uuid: {
    type: String,
    required: true,
    default: () => randomUUID(),
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
});

export default mongoose.model('User', userSchema);
