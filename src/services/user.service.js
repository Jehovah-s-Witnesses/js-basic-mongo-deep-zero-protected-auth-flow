import { User } from '../db/User.js';
import { hash } from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../constants/jwt.js';
const { sign, verify } = jwt.default;

export const userService = {
  findUserByEmail(email) {
    return User.findOne({ email });
  },
  findUserByUserName(username) {
    return User.findOne({ username });
  },
  async createUser(email, username, password) {
    const user = new User({
      username,
      email,
      password: await hash(password, 10),
    });
    await user.save();
    return user;
  },
  createAuthToken(id) {
    const token = sign({ id }, JWT_SECRET, { expiresIn: '2h' });
    return token;
  },
  verifyAuthToken(token) {
    return verify(token, JWT_SECRET);
  },
};
