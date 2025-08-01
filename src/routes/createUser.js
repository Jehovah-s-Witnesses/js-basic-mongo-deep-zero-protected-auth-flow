import { userService } from '../services/user.service.js';

export const createUserRoute = async (request, reply) => {
  const { username, email, password } = request.body;
  const userByEmail = await userService.findUserByEmail(email);
  const userByUsername = await userService.findUserByUserName(username);

  if (userByEmail || userByUsername) {
    return reply.status(400).send({ message: 'user is bad' });
  }

  await userService.createUser(email, username, password);

  reply.status(201).send({ message: 'Successful created' });
};
