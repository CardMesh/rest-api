import mongoose from 'mongoose';

const themeSchema = new mongoose.Schema({
  color: String,
});

export default mongoose.model('Theme', themeSchema);
