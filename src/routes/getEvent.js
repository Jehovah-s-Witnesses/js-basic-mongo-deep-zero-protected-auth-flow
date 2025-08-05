import { eventService } from '../services/event.service.js';

export const getEvent = async (request, reply) => {
  const { userId } = request;

  const event = await eventService.userEvent(userId);

  if (!event) {
    reply.status(401).send({ message: 'Event does not exist' });
  }

  reply.status(201).send(event);
};
