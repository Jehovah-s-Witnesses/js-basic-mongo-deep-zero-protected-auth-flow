import mongoose, { Mongoose } from 'mongoose';

/**
 * @param {string} url
 * @returns Promise<Mongoose>
 */
export const connectToMongoose = (url) => {
  return mongoose.connect(url);
};
