import { userService } from '../services/user.service.ts';
import { compare } from 'bcrypt';
import type { RouteHandler } from 'fastify';

export const createTokenForUser: RouteHandler<{
  Body: { username: string; email: string; password: string };
}> = async (request, reply) => {
  const { username, email, password } = request.body;

  let user = null;

  if (email) {
    user = await userService.findUserByEmail(email);
  }

  if (username) {
    user = await userService.findUserByUserName(username);
  }

  if (!user) {
    return reply.status(400).send({ message: 'User does not exist' });
  }

  const isCorrectPassword = await compare(password, user.password);

  if (!isCorrectPassword) {
    return reply.status(400).send({ message: 'Password is not correct' });
  }

  const token = userService.createAuthToken(user._id.toString());

  reply.status(201).send({ token, message: 'User was successful authorized' });
};
