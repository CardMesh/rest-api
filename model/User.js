import mongoose from 'mongoose';
import { randomUUID } from 'crypto';

const vCardOptionsSchema = new mongoose.Schema({
  firstName: String,
  middleName: String,
  lastName: String,
  title: String,
  pronouns: String,
  company: String,
  bio: String,
  phone: String,
  cell: String,
  email: String,
  web: String,
  street: String,
  state: String,
  city: String,
  postalCode: String,
  country: String,
  timeZone: String,
  gender: String,
  birthday: String,
  role: String,
  language: String,
  latitude: Number,
  longitude: Number,
  suffix: String,
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
