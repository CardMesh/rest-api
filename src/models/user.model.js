import mongoose from 'mongoose';
import { randomUUID } from 'crypto';

const defaultTrimmedString = {
  type: String,
  trim: true,
  default: '',
};

const PersonSchema = new mongoose.Schema({
  firstName: defaultTrimmedString,
  middleName: defaultTrimmedString,
  lastName: defaultTrimmedString,
  suffix: defaultTrimmedString,
  birthday: defaultTrimmedString,
  pronouns: defaultTrimmedString,
}, { _id: false });

const ProfessionalSchema = new mongoose.Schema({
  title: defaultTrimmedString,
  company: defaultTrimmedString,
  role: defaultTrimmedString,
  bio: defaultTrimmedString,
}, { _id: false });

const defaultContactInfo = {
  number: defaultTrimmedString,
  countryCode: defaultTrimmedString,
  extension: defaultTrimmedString,
};

const ContactSchema = new mongoose.Schema({
  phone: defaultContactInfo,
  email: defaultTrimmedString,
  web: defaultTrimmedString,
}, { _id: false });

const LocationSchema = new mongoose.Schema({
  street: defaultTrimmedString,
  storey: defaultTrimmedString,
  city: defaultTrimmedString,
  state: defaultTrimmedString,
  postalCode: defaultTrimmedString,
  country: defaultTrimmedString,
  timeZone: defaultTrimmedString,
  coordinates: {
    latitude: {
      type: Number,
      default: 0,
    },
    longitude: {
      type: Number,
      default: 0,
    },
  },
}, { _id: false });

const SocialMediaSchema = new mongoose.Schema({
  twitter: defaultTrimmedString,
  linkedin: defaultTrimmedString,
  facebook: defaultTrimmedString,
  instagram: defaultTrimmedString,
  pinterest: defaultTrimmedString,
  github: defaultTrimmedString,
}, { _id: false });

const ClickSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
  },
  source: { type: String },
}, { _id: false });

const AvatarSchema = new mongoose.Schema({
  size: {
    height: {
      type: Number,
    },
    width: {
      type: Number,
    },
  },
  format: {
    png: {
      type: String,
    },
    webp: {
      type: String,
    },
  },
}, { _id: false });

const vCardSchema = new mongoose.Schema({
  person: PersonSchema,
  professional: ProfessionalSchema,
  contact: ContactSchema,
  location: LocationSchema,
  socialMedia: SocialMediaSchema,
  avatar: AvatarSchema,
}, { _id: false });

const UserSchema = new mongoose.Schema({
  themeId: {
    type: Number,
    default: 1,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true,
    match: [/.+@.+\..+/, 'Please fill a valid email address.'],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024,
  },
  clicks: [ClickSchema],
  vCard: vCardSchema,
  settings: {
    theme: {
      type: String,
      required: true,
      default: 'dark',
      enum: ['dark', 'light'],
    },
  },
  uuid: {
    type: String,
    required: true,
    default: () => randomUUID(),
    unique: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'editor'],
    default: 'user',
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
});

export default mongoose.model('User', UserSchema);
