import mongoose from 'mongoose';
import { randomUUID } from 'crypto';

const vCardSchema = new mongoose.Schema({
  person: {
    firstName: {
      type: String,
      default: '',
    },
    middleName: {
      type: String,
      default: '',
    },
    lastName: {
      type: String,
      default: '',
    },
    suffix: {
      type: String,
      default: '',
    },
  },
  professional: {
    title: {
      type: String,
      default: '',
    },
    company: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
  },
  contact: {
    phone: {
      number: {
        type: String,
        default: '',
      },
      countryCode: {
        type: String,
        default: '',
      },
      extension: {
        type: String,
        default: '',
      },
    },
    email: {
      type: String,
      default: '',
    },
    web: {
      type: String,
      default: '',
    },
  },
  location: {
    street: {
      type: String,
      default: '',
    },
    storey: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      default: '',
    },
    state: {
      type: String,
      default: '',
    },
    postalCode: {
      type: String,
      default: '',
    },
    country: {
      type: String,
      default: '',
    },
    timeZone: {
      type: String,
      default: '',
    },
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
  },
  socialMedia: {
    twitter: {
      type: String,
      default: '',
    },
    linkedin: {
      type: String,
      default: '',
    },
    facebook: {
      type: String,
      default: '',
    },
    instagram: {
      type: String,
      default: '',
    },
    pinterest: {
      type: String,
      default: '',
    },
    github: {
      type: String,
      default: '',
    },
  },
  personal: {
    birthday: {
      type: String,
      default: '',
    },
    pronouns: {
      type: String,
      default: '',
    },
  },
});

const clickSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
  },
  source: { type: String },
});

const userSchema = new mongoose.Schema({
  themeId: {
    type: Number,
    default: 1,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024,
  },
  clicks: [clickSchema],
  vCard: vCardSchema,
  settings: {
    theme: {
      type: String,
      required: true,
      default: 'dark',
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
});

export default mongoose.model('User', userSchema);
