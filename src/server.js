import { initializeServer } from './initializers/initializeServer.js';

export const server = await initializeServer();

server.route({
  url: '/',
  handler() {
    return 'hello';
  },
  method: 'GET',
});
