import mongoose from 'mongoose';

export const connectToMongoose = (url: string) => {
  return mongoose.connect(url);
};
