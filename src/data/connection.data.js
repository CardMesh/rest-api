import mongoose from 'mongoose';
import { mongooseOptions } from '../configs/mongoose.config.js';

mongoose.set('strictQuery', true);

export default (db) => mongoose.connect(
  db,
  mongooseOptions,
);
