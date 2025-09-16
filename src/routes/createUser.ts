import { userService } from '../services/user.service.ts';
import type { RouteHandler } from 'fastify';

export const createUserRoute: RouteHandler<{
  Body: { username: string; email: string; password: string };
}> = async (request, reply) => {
  const { username, email, password } = request.body;
  const userByEmail = await userService.findUserByEmail(email);
  const userByUsername = await userService.findUserByUserName(username);

  if (userByEmail || userByUsername) {
    return reply
      .status(400)
      .send({ message: 'User with this email or username already exist' });
  }

  await userService.createUser(email, username, password);

  reply.status(201).send({ message: 'Successful created' });
};
