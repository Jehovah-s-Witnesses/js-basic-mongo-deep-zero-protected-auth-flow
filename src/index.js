import { server } from './server.js';
import { connectToMongoose } from './initializers/connectToMongoose.js';

connectToMongoose('mongodb://root:example@127.0.0.1:27018/').then(() =>
  server
    .listen({
      port: 4046,
    })
    .then(() => {
      server.log.info('Started');
    }),
);
