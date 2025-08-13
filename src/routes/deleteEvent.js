import { eventService } from '../services/event.service.js';

export const deleteEventRoute = async (request, reply) => {
  const { id } = request.params;
  const { userId } = request;

  await eventService.deleteEvent(userId, id);

  reply.status(204).send();
};
