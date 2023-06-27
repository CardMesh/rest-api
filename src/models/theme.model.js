import mongoose from 'mongoose';

const defaultTrue = {
  type: Boolean,
  default: true,
};

const DisplaySchema = new mongoose.Schema({
  phone: defaultTrue,
  sms: defaultTrue,
  email: defaultTrue,
  web: defaultTrue,
  address: defaultTrue,
  map: defaultTrue,
  vCardBtn: defaultTrue,
}, { _id: false });

const defaultColor = {
  type: String,
  trim: true,
  required: true,
  match: [/^#(?:[0-9a-fA-F]{3}){1,2}$/, 'Please fill a valid hex color.'],
};

const themeSchema = new mongoose.Schema({
  themeId: {
    type: Number,
    required: true,
    unique: true,
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
    socialIcons: {
      font: {
        ...defaultColor,
        default: '#182d30',
      },
      background: {
        ...defaultColor,
        default: '#dee1dd',
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
  logo: {
    height: {
      type: Number,
      default: 20,
      required: true,
    },
  },
});

export default mongoose.model('Theme', themeSchema);
