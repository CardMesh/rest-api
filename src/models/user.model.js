import { randomUUID } from 'crypto';
import mongoose from 'mongoose';

const schemaOptions = { _id: false };

const defaultTrimmedString = {
  type: String,
  trim: true,
  default: '',
};

const createSchema = (definition) => new mongoose.Schema(definition, schemaOptions);

const PersonSchema = createSchema({
  firstName: defaultTrimmedString,
  middleName: defaultTrimmedString,
  lastName: defaultTrimmedString,
  suffix: defaultTrimmedString,
  birthday: defaultTrimmedString,
  pronouns: defaultTrimmedString,
});

const ProfessionalSchema = createSchema({
  title: defaultTrimmedString,
  company: defaultTrimmedString,
  role: defaultTrimmedString,
  bio: defaultTrimmedString,
});

const defaultContactInfo = {
  number: defaultTrimmedString,
  countryCode: defaultTrimmedString,
  extension: defaultTrimmedString,
};

const ContactSchema = createSchema({
  phone: defaultContactInfo,
  email: defaultTrimmedString,
  web: defaultTrimmedString,
  file: {
    url: defaultTrimmedString,
    name: defaultTrimmedString,
  },
});

const LocationSchema = createSchema({
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
});

const SocialMediaSchema = createSchema({
  twitter: defaultTrimmedString,
  linkedin: defaultTrimmedString,
  facebook: defaultTrimmedString,
  instagram: defaultTrimmedString,
  pinterest: defaultTrimmedString,
  github: defaultTrimmedString,
});

const ClickSchema = createSchema({
  timestamp: {
    type: Date,
    default: Date.now,
  },
  source: { type: String },
});

const AvatarSchema = createSchema({
  size: {
    height: { type: Number },
    width: { type: Number },
  },
  format: {
    png: { type: String },
    webp: { type: String },
  },
});

const vCardSchema = createSchema({
  person: PersonSchema,
  professional: ProfessionalSchema,
  contact: ContactSchema,
  location: LocationSchema,
  socialMedia: SocialMediaSchema,
  avatar: AvatarSchema,
});

const UserSchema = new mongoose.Schema({
  themeId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
    default: () => randomUUID(),
    unique: true,
    index: true,
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
  role: {
    type: String,
    enum: ['user', 'admin', 'editor'],
    default: 'user',
  },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
});

export default mongoose.model('User', UserSchema);
