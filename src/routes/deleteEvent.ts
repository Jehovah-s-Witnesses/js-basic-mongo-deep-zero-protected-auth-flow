import { eventService } from '../services/event.service.ts';
import type { RouteHandler } from 'fastify';

export const deleteEventRoute: RouteHandler<{
  Params: { id: string };
}> = async (request, reply) => {
  const { id } = request.params;
  const { userId } = request;

  await eventService.deleteEvent(userId, id);

  reply.status(204).send();
};
