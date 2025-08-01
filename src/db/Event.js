import { model, Types } from 'mongoose';

export const Event = model('Event', {
  _id: {
    type: Types.ObjectId,
    default: () => {
      return new Types.ObjectId();
    },
  },
  title: String,
  plannedDate: Date,
  userId: {
    type: Types.ObjectId,
    ref: 'User',
  },
});
