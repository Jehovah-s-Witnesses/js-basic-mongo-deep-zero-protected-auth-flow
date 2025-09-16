import { model, Types, Schema } from 'mongoose';

const userSchema = new Schema({
  _id: {
    type: Types.ObjectId,
    default: () => {
      return new Types.ObjectId();
    },
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export const User = model('User', userSchema);
