import { server } from './server.js';

server
  .listen({
    port: 4046,
  })
  .then(() => {
    server.log.info('Started');
  });
