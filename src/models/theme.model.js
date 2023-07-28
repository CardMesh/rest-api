import { randomUUID } from 'crypto';
import mongoose from 'mongoose';

const defaultTrue = {
  type: Boolean,
  default: true,
};

const DisplaySchema = new mongoose.Schema({
  logo: defaultTrue,
  phone: defaultTrue,
  sms: defaultTrue,
  email: defaultTrue,
  web: defaultTrue,
  address: defaultTrue,
  map: defaultTrue,
  vCardBtn: defaultTrue,
}, { _id: false });

const AlignSchema = new mongoose.Schema({
  logo: {
    type: String,
    enum: ['start', 'center', 'end'],
    default: 'start',
  },
  avatar: {
    type: String,
    enum: ['start', 'center', 'end'],
    default: 'center',
  },
  heading: {
    type: String,
    enum: ['start', 'center', 'end'],
    default: 'center',
  },
  bio: {
    type: String,
    enum: ['start', 'center', 'end'],
    default: 'center',
  },
  socialIcons: {
    type: String,
    enum: ['start', 'center', 'end'],
    default: 'start',
  },
}, { _id: false });

const defaultColor = {
  type: String,
  trim: true,
  required: true,
  match: [/^#(?:[0-9a-fA-F]{3}){1,2}$/, 'Please fill a valid hex color.'],
};

const LogoSchema = new mongoose.Schema({
  size: {
    height: {
      type: Number,
      default: 30,
    },
    width: {
      type: Number,
    },
  },
  format: {
    png: {
      type: String,
      default: '',
    },
    webp: {
      type: String,
      default: '',
    },
  },
}, { _id: false });

const themeSchema = new mongoose.Schema({
  themeId: {
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
  color: {
    font: {
      primary: {
        ...defaultColor,
        default: '#182d30',
      },
      secondary: {
        ...defaultColor,
        default: '#2f575d',
      },
    },
    background: {
      ...defaultColor,
      default: '#dee1dd',
    },
    contactIcons: {
      font: {
        ...defaultColor,
        default: '#182d30',
      },
      background: {
        ...defaultColor,
        default: '#dee1dd',
      },
    },
    socialIcons: {
      font: {
        type: String,
        trim: true,
        default: '',
      },
      background: {
        type: String,
        trim: true,
        default: '',
      },
    },
    vCardBtn: {
      font: {
        ...defaultColor,
        default: '#dee1dd',
      },
      background: {
        ...defaultColor,
        default: '#182d30',
      },
    },
  },
  display: DisplaySchema,
  align: AlignSchema,
  logo: LogoSchema,
});

export default mongoose.model('Theme', themeSchema);
