import { userService } from '../services/user.service.js';
import { compare } from 'bcrypt';

export const createTokenForUser = async (request, reply) => {
  const { username, email, password } = request.body;

  let user = null;

  if (username) {
    user = await userService.findUserByUserName(username);
  }

  if (email) {
    user = await userService.findUserByEmail(email);
  }

  if (!user) {
    return reply.status(400).send({});
  }

  const isCorrectPassword = await compare(password, user.password);

  if (!isCorrectPassword) {
    return reply.status(400).send({});
  }

  const token = userService.createAuthToken(user._id);

  reply.status(201).send({ token });
};
