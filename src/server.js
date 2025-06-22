import { initializeServer } from './initializers/initializeServer.js';
import { User } from './db/User.js';
import { compare, hash } from 'bcrypt';
import { Types } from 'mongoose';
import * as jwt from 'jsonwebtoken';

const { sign, verify } = jwt.default;

export const server = await initializeServer();

server.register(
  (instance, opts, done) => {
    instance.post(
      '/user',
      {
        schema: {
          body: {
            type: 'object',
            properties: {
              password: {
                type: 'string',
                minLength: 8,
                maxLength: 20,
              },
              username: {
                type: 'string',
                minLength: 2,
                maxLength: 30,
              },
              email: {
                format: 'email',
                type: 'string',
                minLength: 6,
                maxLength: 40,
              },
            },
            required: ['password', 'email', 'username'],
          },
        },
      },
      async (request, reply) => {
        const { username, password, email } = request.body;

        if (await User.findOne({ username })) {
          return reply.status(400).send({});
        }

        if (await User.findOne({ email })) {
          return reply.status(400).send({});
        }

        const user = new User({
          email,
          password: await hash(password, 10),
          username,
          _id: new Types.ObjectId(),
        });

        await user.save();

        return reply.status(201).send({ message: 'Successful created' });
      },
    );

    instance.post(
      '/session',
      {
        schema: {
          body: {
            type: 'object',
            oneOf: [
              {
                properties: {
                  password: {
                    type: 'string',
                    minLength: 8,
                    maxLength: 20,
                  },
                  email: {
                    format: 'email',
                    type: 'string',
                    minLength: 6,
                    maxLength: 40,
                  },
                },

                required: ['password', 'email'],
              },

              {
                properties: {
                  password: {
                    type: 'string',
                    minLength: 8,
                    maxLength: 20,
                  },
                  username: {
                    type: 'string',
                    minLength: 2,
                    maxLength: 30,
                  },
                },

                required: ['password', 'username'],
              },
            ],
          },
        },
      },
      async (request, reply) => {
        const { username, password, email } = request.body;

        if (username && !(await User.findOne({ username }))) {
          return reply.status(400).send({});
        }

        if (email && !(await User.findOne({ email }))) {
          return reply.status(400).send({});
        }

        const filter = {};

        if (username) {
          filter.username = username;
        }

        if (email) {
          filter.email = email;
        }

        const user = await User.findOne(filter);

        if (!(await compare(password, user.password))) {
          return reply.status(400).send();
        }

        reply.status(201).send({
          token: sign({ id: user._id }, 'Secret key', {
            expiresIn: '2h',
          }),
        });
      },
    );

    instance.register(
      (protectedInstance, opts, done) => {
        protectedInstance.addHook('preHandler', (request, reply, next) => {
          const { authorization: token } = request.headers;

          try {
            verify(token, 'Secret key');
            next();
          } catch (err) {
            reply.status(400).send(err.message);
          }
        });

        protectedInstance.get(
          '',
          {
            schema: {
              headers: {
                type: 'object',
                properties: {
                  authorization: {
                    type: 'string',
                  },
                },
                required: ['authorization'],
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
  {
    prefix: '/api/v1',
  },
);

server.route({
  url: '/',
  handler() {
    return 'hello';
  },
  method: 'GET',
});
