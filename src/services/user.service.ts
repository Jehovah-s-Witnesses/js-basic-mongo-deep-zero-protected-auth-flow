import { User } from '../db/User.ts';
import { hash } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { JWT_SECRET } from '../constants/jwt.ts';

export const userService = {
  findUserByEmail(email: string) {
    return User.findOne({ email });
  },
  findUserByUserName(username: string) {
    return User.findOne({ username });
  },
  async createUser(email: string, username: string, password: string) {
    const user = new User({
      username,
      email,
      password: await hash(password, 10),
    });
    await user.save();
    return user;
  },
  createAuthToken(id: string) {
    const token = sign({ id }, JWT_SECRET, { expiresIn: '2h' });
    return token;
  },
  verifyAuthToken(token: string) {
    return verify(token, JWT_SECRET) as { id: string };
  },
};
