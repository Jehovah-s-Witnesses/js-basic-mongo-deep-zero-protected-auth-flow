import { eventService } from '../services/event.service.js';

export const getEvent = async (request, reply) => {
  const { userId } = request;

  const event = await eventService.userEvent(userId);

  reply.status(201).send(event);
};
