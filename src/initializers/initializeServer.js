import fastifyMultipart from '@fastify/multipart';
import fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyCookie from '@fastify/cookie';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fastifyStatic from '@fastify/static';

export const initializeServer = async () => {
  const server = fastify({
    logger: {
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      },
    },
  }).withTypeProvider();

  await server.register(fastifyCors);
  await server.register(fastifyCookie);
  await server.register(fastifySwagger);
  await server.register(fastifySwaggerUi);
  await server.register(fastifyStatic, {
    root: `${process.cwd()}/public`,
  });
  await server.register(fastifyMultipart, {
    attachFieldsToBody: 'keyValues',
  });

  return server;
};
