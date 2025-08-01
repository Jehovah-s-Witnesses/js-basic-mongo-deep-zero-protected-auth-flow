import { userService } from '../services/user.service.js';

export const verifyAuthToken = async (request, reply) => {
  const token = request.headers.authorization;

  try {
    userService.verifyAuthToken(token);
    return reply.send('Hello from protected');
  } catch (err) {
    reply.status(401).send('You are not authorized');
  }
};
