import mongoose from 'mongoose';

const themeSchema = new mongoose.Schema({
  fontColor: String,
  backgroundColor: String,
  displayMap: String,
});

export default mongoose.model('Theme', themeSchema);
