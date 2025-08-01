import { eventService } from '../services/event.service.js';

export const createEvent = async (request, reply) => {
  const { title, plannedDate } = request.body;
  const { userId } = request;

  const event = await eventService.createEvent(title, plannedDate, userId);

  reply.status(201).send(event);
};
