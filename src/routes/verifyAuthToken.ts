import { userService } from '../services/user.service.ts';
import type { RouteHandler } from 'fastify';

export const verifyAuthToken: RouteHandler<{
  Headers: { authorization: string };
}> = async (request, reply) => {
  const token = request.headers.authorization;

  try {
    const { id } = userService.verifyAuthToken(token);

    request.userId = id;
  } catch (err) {
    reply.status(401).send('You are not authorized');
  }
};
