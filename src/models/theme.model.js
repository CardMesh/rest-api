import mongoose from 'mongoose';

const themeSchema = new mongoose.Schema({
  themeId: {
    type: Number,
    required: true,
    unique: true,
  },
  color: {
    font: {
      secondary: {
        type: String,
        default: '',
      },
      primary: {
        type: String,
        default: '',
      },
    },
    background: {
      type: String,
      default: '',
    },
    socialIcons: {
      font: {
        type: String,
        default: '',
      },
      background: {
        type: String,
        default: '',
      },
    },
    vCardBtn: {
      font: {
        type: String,
        default: '',
      },
      background: {
        type: String,
        default: '',
      },
    },
  },
  display: {
    phone: {
      type: Boolean,
      default: true,
    },
    sms: {
      type: Boolean,
      default: true,
    },
    email: {
      type: Boolean,
      default: true,
    },
    web: {
      type: Boolean,
      default: true,
    },
    address: {
      type: Boolean,
      default: true,
    },
    map: {
      type: Boolean,
      default: true,
    },
    vCardBtn: {
      type: Boolean,
      default: true,
    },
  },
  logo: {
    height: Number,
  },
  vCardBtn: {
    text: {
      type: String,
      default: '',
    },
  },
});

export default mongoose.model('Theme', themeSchema);
