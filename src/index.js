import { server } from './server.js';


server
  .listen({
    port: 4043,
  })
  .then(() => {
    server.log.info('Started');
  });
