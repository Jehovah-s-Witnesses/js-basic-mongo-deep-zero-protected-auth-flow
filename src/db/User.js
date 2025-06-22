import mongoose, { Types } from 'mongoose';

export const User = mongoose.model('User', {
  _id: Types.ObjectId,
  username: String,
  email: String,
  password: String,
});
