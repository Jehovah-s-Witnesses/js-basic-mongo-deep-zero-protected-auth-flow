import { Event } from '../db/Event.js';

export const eventService = {
  userEvent(userId) {
    return Event.find({ userId });
  },
  async createEvent(title, plannedDate, userId) {
    const event = new Event({
      title,
      plannedDate,
      userId,
    });

    await event.save();

    return event;
  },
};
