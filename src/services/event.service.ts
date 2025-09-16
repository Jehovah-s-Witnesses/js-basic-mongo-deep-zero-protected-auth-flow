import { Event } from '../db/Event.ts';

export const eventService = {
  async getEvents(userId: string, limit: number, offset: number) {
    const count = await Event.countDocuments({ userId });

    const events = await Event.find({ userId }).limit(limit).skip(offset);

    return { count: count, items: events };
  },
  async createEvent(title: string, plannedDate: string, userId: string) {
    const event = new Event({
      title,
      plannedDate,
      userId,
    });

    await event.save();

    return event;
  },

  async deleteEvent(userId: string, id: string) {
    await Event.deleteOne({ userId, _id: id });
  },
};
