import postgres from 'postgres';

/**
 * @param {string} url
 */
export const connectToPostgres = (url) => {
  return postgres(url);
};
