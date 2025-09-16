import { server } from './server.ts';
import { connectToMongoose } from './initializers/connectToMongoose.ts';

connectToMongoose('mongodb://root:example@localhost:27019/')
  .then(() => {
    return server.listen({
      port: 4046,
    });
  })
  .then(() => {
    server.log.info('Started');
  });
