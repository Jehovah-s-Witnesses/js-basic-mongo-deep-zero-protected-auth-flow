import { describe, it, expect } from 'vitest';
import { server } from './server.js';

describe('Basic test server', () => {
  it('should returns correct value', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/',
    });

    expect(response.statusCode).toStrictEqual(200);
    expect(response.body).toStrictEqual('hello');
  });
});
