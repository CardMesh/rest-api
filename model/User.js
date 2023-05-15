import mongoose from 'mongoose';
import { randomUUID } from 'crypto';

const vCardOptionsSchema = new mongoose.Schema({
  name: {
    firstName: String,
    middleName: String,
    lastName: String,
    suffix: String,
  },
  professional: {
    title: String,
    company: String,
    role: String,
    bio: String,
  },
  contact: {
    phone: {
      number: String,
      countryCode: String,
      extension: String,
    },
    email: String,
    web: String,
  },
  location: {
    street: String,
    storey: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
    timeZone: String,
    coordinates: {
      latitude: Number,
      longitude: Number,
    },
  },
  socialMedia: {
    twitter: String,
    linkedin: String,
    facebook: String,
    instagram: String,
    pinterest: String,
    github: String,
  },
  personal: {
    birthday: String, // TODO use in frontend
    pronouns: String,
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
