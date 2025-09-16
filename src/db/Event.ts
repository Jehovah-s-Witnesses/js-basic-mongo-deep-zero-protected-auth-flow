import { model, Types, Schema } from 'mongoose';

const eventSchema = new Schema({
  _id: {
    type: Types.ObjectId,
    default: () => {
      return new Types.ObjectId();
    },
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  plannedDate: {
    type: Date,
    required: true,
  },
  userId: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  },
});
export const Event = model('Event', eventSchema);
