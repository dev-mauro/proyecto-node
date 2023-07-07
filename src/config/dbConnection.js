import mongoose from 'mongoose';
import { mongoURL } from './config.js';

// Mongoose connect
const connectDB = () => {
  console.log(mongoURL)
  mongoose.connect(mongoURL);
}

export { connectDB };