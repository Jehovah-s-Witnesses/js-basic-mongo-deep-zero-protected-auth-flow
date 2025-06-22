import { describe, it, expect } from 'vitest';
import { server } from './server.js';
import { connectToMongoose } from './initializers/connectToMongoose.js';

describe('Basic test server', () => {
  it('should returns only 400 errors', async () => {
    await connectToMongoose(
      process.env.MONGO_URI || 'mongodb://root:example@127.0.0.1:27018/',
    );

    const responses = await Promise.all([
      server.inject({
        method: 'POST',
        url: '/api/v1/user',
        body: {
          username: 't',
        },
      }),
      server.inject({
        method: 'POST',
        url: '/api/v1/user',
        body: {
          email: 't',
        },
      }),
      server.inject({
        method: 'POST',
        url: '/api/v1/user',
        body: {
          password: '',
        },
      }),
      server.inject({
        method: 'POST',
        url: '/api/v1/user',
        body: {
          email: 'ttest',
          username: 'rammfall',
          password: '12341234',
        },
      }),
    ]);

    responses.forEach(({ statusCode }) => {
      expect(statusCode).toStrictEqual(400);
    });
  });

  it('should returns correct value', async () => {
    await connectToMongoose(
      process.env.MONGO_URI || 'mongodb://root:example@127.0.0.1:27018/',
    );
    const response = await server.inject({
      method: 'POST',
      url: '/api/v1/user',
      body: {
        username: 'rammfall',
        password: '12341234',
        email: 'rammfall@test.test',
      },
    });

    expect(response.statusCode).toStrictEqual(201);
    expect(JSON.parse(response.body)).toStrictEqual({
      message: 'Successful created',
    });

    const existedEmailResponse = await server.inject({
      method: 'POST',
      url: '/api/v1/user',
      body: {
        username: 'rammfalll',
        password: '12341234',
        email: 'rammfall@test.test',
      },
    });

    expect(existedEmailResponse.statusCode).toStrictEqual(400);

    const existedUsernameResponse = await server.inject({
      method: 'POST',
      url: '/api/v1/user',
      body: {
        username: 'rammfall',
        password: '12341234',
        email: 'rammfall@test.testtd',
      },
    });

    expect(existedUsernameResponse.statusCode).toStrictEqual(400);

    const loginResponse = await server.inject({
      method: 'POST',
      url: '/api/v1/session',
      body: {
        username: 'rammfall',
        password: '12341234',
      },
    });

    expect(loginResponse.statusCode).toStrictEqual(201);
    const loginEmailResponse = await server.inject({
      method: 'POST',
      url: '/api/v1/session',
      body: {
        email: 'rammfall@test.test',
        password: '12341234',
      },
    });

    expect(loginEmailResponse.statusCode).toStrictEqual(201);

    const loginEmailErrorResponse = await server.inject({
      method: 'POST',
      url: '/api/v1/session',
      body: {
        email: 'rammfall@test.test',
        username: 'rammfall',
        password: '12341234',
      },
    });

    expect(loginEmailErrorResponse.statusCode).toStrictEqual(400);

    const withoutHeaderResponse = await server.inject({
      method: 'GET',
      url: '/api/v1/protected',
    });

    expect(withoutHeaderResponse.statusCode).toStrictEqual(400);

    const withHeaderResponse = await server.inject({
      method: 'GET',
      url: '/api/v1/protected',
      headers: {
        authorization: JSON.parse(loginEmailResponse.body).token,
      },
    });

    expect(withHeaderResponse.statusCode).toStrictEqual(200);
    expect(withHeaderResponse.body).toStrictEqual('Hello from protected');
  });
});
