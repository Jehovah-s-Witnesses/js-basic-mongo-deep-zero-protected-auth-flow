import { eventService } from '../services/event.service.ts';
import type { RouteHandler } from 'fastify';

export const getEvent: RouteHandler<{
  Querystring: { limit: number; offset: number };
}> = async (request, reply) => {
  const { userId } = request;
  const { limit, offset } = request.query;

  const events = await eventService.getEvents(userId, limit, offset);

  reply.send(events);
};
