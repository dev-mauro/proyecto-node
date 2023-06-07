import mongoose from 'mongoose';

const userCollection = 'users';

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cart: {
    type: mongoose.Schema.ObjectId,
    ref: 'carts'
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
});

const userModel = new mongoose.model(userCollection, userSchema);

export default userModel;