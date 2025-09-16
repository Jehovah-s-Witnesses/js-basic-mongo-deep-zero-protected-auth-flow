import { initializeServer } from './initializers/initializeServer.ts';
import {
  emailSchema,
  passwordSchema,
  userNameSchema,
} from './schema/schema.ts';
import { createUserRoute } from './routes/createUser.ts';
import { createTokenForUser } from './routes/createTokenForUser.ts';
import { verifyAuthToken } from './routes/verifyAuthToken.ts';
import { createEvent } from './routes/createEvent.ts';
import { getEvent } from './routes/getEvent.ts';
import { deleteEventRoute } from './routes/deleteEvent.ts';

export const server = await initializeServer();

server.route({
  url: '/',
  handler() {
    return 'hello';
  },
  method: 'GET',
});

server.register(
  (instance, _opts, done) => {
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
      (protectedInstance, _opts, done) => {
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
                    maxLength: 50,
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
              querystring: {
                type: 'object',
                properties: {
                  limit: {
                    type: 'integer',
                    minimum: 1,
                    maximum: 10,
                  },
                  offset: {
                    type: 'integer',
                    minimum: 0,
                  },
                },
                required: ['limit', 'offset'],
              },
              response: {
                200: {
                  type: 'object',
                  properties: {
                    count: {
                      type: 'string',
                    },
                    items: {
                      type: 'array',
                    },
                  },
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
          (_request, reply) => {
            reply.send('Hello from protected');
          },
        );

        protectedInstance.delete(
          '/event/:id',
          {
            schema: {
              params: {
                type: 'object',
                required: ['userId', 'id'],
                properties: {
                  userId: {
                    type: 'string',
                  },
                  id: {
                    type: 'string',
                  },
                },
              },
            },
          },
          deleteEventRoute,
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
