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
import { createUserRoute } from './routes/createUser.js';
import { createTokenForUser } from './routes/createTokenForUser.js';
import { verifyAuthToken } from './routes/verifyAuthToken.js';
import { createEvent } from './routes/createEvent.js';
import { getEvent } from './routes/getEvent.js';

const { sign, verify } = jwt.default;

export const server = await initializeServer();

server.route({
  url: '/',
  handler() {
    return 'hello';
  },
  method: 'GET',
});

server.register(
  (instance, opts, done) => {
    instance.post(
      '/user',
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
      createUserRoute,
    );

    instance.post(
      '/session',
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
      createTokenForUser,
    );

    instance.register(
      (protectedInstance, opts, done) => {
        protectedInstance.addHook('preHandler', verifyAuthToken);
        protectedInstance.post(
          '/event',
          {
            schema: {
              body: {
                type: 'object',
                required: ['title', 'plannedDate'],
                properties: {
                  title: {
                    type: 'string',
                    minLength: 4,
                    maxLength: 30,
                  },
                  plannedDate: {
                    type: 'string',
                    format: 'date-time',
                  },
                },
              },
            },
          },
          createEvent,
        );

        protectedInstance.get(
          '/event',
          {
            schema: {
              body: {
                type: 'object',
                properties: {
                  title: {
                    type: 'string',
                    minLength: 4,
                    maxLength: 30,
                  },
                  plannedDate: {
                    type: 'string',
                    format: 'date-time',
                  },
                  userId: {
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
          getEvent,
        );

        protectedInstance.get(
          '',
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
          (request, reply) => {
            reply.send('Hello from protected');
          },
        );

        done();
      },
      {
        prefix: '/protected',
      },
    );

    done();
  },
  { prefix: '/api/v1' },
);
