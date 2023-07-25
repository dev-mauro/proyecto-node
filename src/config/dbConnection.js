import mongoose from 'mongoose';
import { mongoURL } from './config.js';

// Mongoose connect
const connectDB = () => {
  mongoose.connect(mongoURL);
}

export { connectDB };