import { model, Types } from 'mongoose';

export const User = model('User', {
  _id: {
    type: Types.ObjectId,
    default: () => {
      return new Types.ObjectId();
    },
  },
  username: String,
  email: String,
  password: String,
});
