import { eventService } from '../services/event.service.ts';
import type { RouteHandler } from 'fastify';

export const createEvent: RouteHandler<{
  Body: { title: string; plannedDate: string };
}> = async (request, reply) => {
  const { title, plannedDate } = request.body;
  const { userId } = request;

  const event = await eventService.createEvent(title, plannedDate, userId);

  reply.status(201).send(event);
};
