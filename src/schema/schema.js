export const userNameSchema = {
  type: 'string',
  minLength: 2,
  maxLength: 30,
};

export const emailSchema = {
  type: 'string',
  minLength: 6,
  maxLength: 40,
  format: 'email',
};

export const passwordSchema = {
  type: 'string',
  minLength: 8,
  maxLength: 20,
};
