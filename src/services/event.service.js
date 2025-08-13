import { Event } from '../db/Event.js';

export const eventService = {
  async getEvents(userId, limit, offset) {
    const count = await Event.countDocuments({ userId });

    const events = await Event.find({ userId }).limit(limit).skip(offset);

    return { count: count, items: events };
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

  async deleteEvent(userId, id) {
    await Event.deleteOne({ userId, _id: id });
  },
};
