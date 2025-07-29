import { server } from './server.js';
import { connectToMongoose } from './initializers/connectToMongoose.js';

connectToMongoose('mongodb://root:example@localhost:27019/')
  .then(() => {
    return server.listen({
      port: 4046,
    });
  })
  .then(() => {
    server.log.info('Started');
  });
