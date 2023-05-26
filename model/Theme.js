import mongoose from 'mongoose';

const themeSchema = new mongoose.Schema({
  fontColor: String,
  backgroundColor: String,
  secondaryFontColor: String,
  socialIconFontColor: String,
  socialIconBackgroundColor: String,
  btnFontColor: String,
  btnBackgroundColor: String,
  displayPhone: Boolean,
  displaySms: Boolean,
  displayEmail: Boolean,
  displayWeb: Boolean,
  displayAddress: Boolean,
  displayMap: Boolean,
  displayContactBtn: Boolean,
  buttonText: String,
  logoHeight: Number,
  timeZone: String,
});

export default mongoose.model('Theme', themeSchema);
