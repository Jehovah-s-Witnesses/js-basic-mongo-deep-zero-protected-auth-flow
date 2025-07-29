import { initializeServer } from './initializers/initializeServer.js';
import { User } from './db/User.js';
import { compare, hash } from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import {
  emailSchema,
  passwordSchema,
  userNameSchema,
} from './schema/schema.js';
import { userService } from './services/user.service.js';
import { JWT_SECRET } from './constants/jwt.js';

const { sign, verify } = jwt.default;

export const server = await initializeServer();

server.route({
  url: '/',
  handler() {
    return 'hello';
  },
  method: 'GET',
});

server.post(
  '/api/v1/user',
  {
    schema: {
      body: {
        required: ['username', 'email', 'password'],
        type: 'object',
        properties: {
          username: userNameSchema,
          email: emailSchema,
          password: passwordSchema,
        },
      },
    },
  },
  async (request, reply) => {
    const { username, email, password } = request.body;
    const userByEmail = await userService.findUserByEmail(email);
    const userByUsername = await userService.findUserByUserName(username);

    if (userByEmail || userByUsername) {
      return reply.status(400).send({ message: 'User is bad' });
    }

    await userService.createUser(email, username, password);

    reply.status(201).send({ message: 'Successful created' });
  },
);

server.post(
  '/api/v1/session',
  {
    schema: {
      body: {
        type: 'object',
        oneOf: [
          {
            type: 'object',
            required: ['username', 'password'],
            properties: {
              username: userNameSchema,
              password: passwordSchema,
            },
          },
          {
            type: 'object',
            required: ['email', 'password'],
            properties: {
              email: emailSchema,
              password: passwordSchema,
            },
          },
        ],
      },
    },
  },
  async (request, reply) => {
    const { username, email, password } = request.body;

    let user = null;

    if (username) {
      user = userService.findUserByUserName(username);
    }

    if (email) {
      user = userService.findUserByEmail(email);
    }

    if (!user) {
      return reply.status(400).send({});
    }

    const isCorrectPassword = await compare(password, user.password);

    if (!isCorrectPassword) {
      return reply.status(400).send({});
    }

    const token = sign({ id: user._id }, 'Secret key', { expiresIn: '2h' });

    reply.status(201).send({ token });
  },
);

server.get(
  '/api/v1/protected',
  {
    schema: {
      headers: {
        type: 'object',
        required: ['authorization'],
        properties: {
          authorization: {
            type: 'string',
          },
        },
      },
      response: {
        200: {
          type: 'string',
        },
        401: {
          type: 'string',
        },
      },
    },
  },
  async (request, reply) => {
    const token = request.headers.authorization;

    try {
      userService.verifyAuthToken(token);
      return reply.send('Hello from protected');
    } catch (err) {
      reply.status(401).send('You are not authorized');
    }
  },
);
