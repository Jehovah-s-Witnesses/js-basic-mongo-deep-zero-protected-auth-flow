import { eventService } from '../services/event.service.js';

export const getEvent = async (request, reply) => {
  const { userId } = request;
  const { limit, offset } = request.query;

  const events = await eventService.getEvents(userId, limit, offset);

  reply.send(events);
};
