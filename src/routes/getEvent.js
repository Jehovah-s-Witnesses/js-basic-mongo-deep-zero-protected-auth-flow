import { eventService } from '../services/event.service.js';

export const getEvent = async (request, reply) => {
  const { userId } = request;

  const events = await eventService.getEvents(userId);

  reply.send(events);
};
