import { initializeServer } from './initializers/initializeServer.js';
import { User } from './db/User.js';
import { compare, hash } from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { userNameSchema } from './schema/schema.js';

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
          email: {
            type: 'string',
            minLength: 6,
            maxLength: 40,
            format: 'email',
          },
          password: {
            type: 'string',
            minLength: 8,
            maxLength: 20,
          },
        },
      },
    },
  },
  async (request, reply) => {
    const { username, email, password } = request.body;
    const userByEmail = await User.findOne({ email });
    const userByUsername = await User.findOne({ username });

    if (userByEmail || userByUsername) {
      return reply.status(401).send({ message: 'User is bad' });
    }

    const user = new User({
      username,
      email,
      password: await hash(password, 10),
    });
    await user.save();

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
              username: {
                type: 'string',
                minLength: 2,
                maxLength: 30,
              },
              password: {
                type: 'string',
                minLength: 8,
                maxLength: 20,
              },
            },
          },
          {
            type: 'object',
            required: ['email', 'password'],
            properties: {
              email: {
                type: 'string',
                minLength: 6,
                maxLength: 40,
                format: 'email',
              },
              password: {
                type: 'string',
                minLength: 8,
                maxLength: 20,
              },
            },
          },
        ],
      },
    },
  },
  async (request, reply) => {
    const { username, email, password } = request.body;
    const filter = {};

    if (username) {
      filter.username = username;
    }

    if (email) {
      filter.email = email;
    }

    const user = await User.findOne(filter);

    if (!user) {
      return reply.status(401).send({});
    }

    const isCorrectPassword = await compare(password, user.password);

    if (!isCorrectPassword) {
      return reply.status(401).send({});
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
    const authHeaders = request.headers.authorization;

    if (!authHeaders) {
      return reply
        .status(401)
        .type('text/plain')
        .send('You are not authorized!');
    }

    const checkHeaders = await verify(authHeaders, 'Secret key');
    return reply.status(200).type('text/plain').send('Hello from protected');
  },
);
