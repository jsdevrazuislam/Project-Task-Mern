import { Event } from "@/models/events.models";
import { Request, Response } from "express";
import asyncHandler from "@/utils/async-handler";
import ApiResponse from "@/utils/api-response";
import { cache, clearEventCache, clearMyEventsCache } from "@/utils/cache";
import ApiError from "@/utils/api-error";
import { ObjectId, PipelineStage } from "mongoose";
import { faker } from "@faker-js/faker";

const generateMockEvents = async (count = 50, userId: string) => {
  const events = [];

  for (let i = 0; i < count; i++) {
    const startDate = faker.date.soon({
      days: 30,
    });

    events.push({
      title: faker.helpers.arrayElement([
        `${faker.word.adjective()} ${faker.word.noun()} Conference`,
        `${faker.company.name()} Workshop`,
        `${faker.location.city()} Tech Meetup`,
        `${faker.word.adverb()} ${faker.word.verb()} Seminar`,
      ]),
      date: startDate,
      time: `${startDate.getHours().toString().padStart(2, "0")}:${startDate
        .getMinutes()
        .toString()
        .padStart(2, "0")}`,
      location: `${faker.location.streetAddress()}, ${faker.location.city()}`,
      description: faker.lorem.paragraphs(2),
      createdBy: userId,
    });
  }

  return events;
};

export const createEvent = asyncHandler(async (req: Request, res: Response) => {
  const { title, date, time, location, description } = req.body;
  const event = await Event.create({
    title,
    date: new Date(date),
    time,
    location,
    description,
    createdBy: req.user._id,
  });

  clearEventCache();
  clearMyEventsCache(req.user._id);
  return res.json(
    new ApiResponse(
      200,
      {
        ...event?.toJSON(),
        createdBy: {
          _id: req.user._id,
          name: req.user.name,
        },
      },
      "Event created"
    )
  );
});

export const getAllEvents = asyncHandler(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const search = req.query.search?.toString()?.trim() || "";
    const from = req.query.from ? new Date(req.query.from.toString()) : null;
    const to = req.query.to ? new Date(req.query.to.toString()) : null;

    const cacheKey = `events_page_${page}_limit_${limit}_search_${search}_from_${
      from ?? "none"
    }_to_${to ?? "none"}`;
    const cached = cache.get(cacheKey);

    if (cached) {
      return res.json(
        new ApiResponse(200, cached, "Events fetched from cache")
      );
    }

    const matchFilter: Record<string, any> = {};

    if (search) {
      matchFilter.title = { $regex: new RegExp(search, "i") };
    }

    if (from || to) {
      matchFilter.date = {};

      if (from) {
        const fromDate = new Date(from);
        fromDate.setHours(0, 0, 0, 0);
        matchFilter.date.$gte = fromDate;
      }

      if (to) {
        const toDate = new Date(to);
        toDate.setHours(23, 59, 59, 999);
        matchFilter.date.$lte = toDate;
      }
    }

    const pipeline: PipelineStage[] = [];

    if (Object.keys(matchFilter).length > 0) {
      pipeline.push({ $match: matchFilter });
    }

    pipeline.push(
      { $sort: { date: 1 } },

      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "createdBy",
        },
      },
      {
        $unwind: {
          path: "$createdBy",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          date: 1,
          time: 1,
          location: 1,
          description: 1,
          attendeeCount: 1,
          joinedUsers: 1,
          createdAt: 1,
          updatedAt: 1,
          "createdBy._id": 1,
          "createdBy.name": 1,
        },
      },
      { $skip: skip },
      { $limit: limit }
    );

    const events = await Event.aggregate(pipeline);

    const total = await Event.countDocuments(matchFilter);

    const result = {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      events,
    };

    cache.set(cacheKey, result);

    return res.json(
      new ApiResponse(200, result, "Events fetched successfully")
    );
  }
);

export const updateEvent = asyncHandler(async (req: Request, res: Response) => {
  const { title, name, date, time, location, description } = req.body;
  const event = await Event.findOneAndUpdate(
    { _id: req.params.id, createdBy: req.user._id },
    {
      title,
      name,
      date,
      time,
      location,
      description,
    },
    { new: true }
  );
  if (!event) throw new ApiError(404, "Event Not Found");
  clearEventCache();
  clearMyEventsCache(req.user._id);
  return res.json(new ApiResponse(200, event, "Event created"));
});

export const deleteEvent = asyncHandler(async (req: Request, res: Response) => {
  const event = await Event.findOneAndDelete({
    _id: req.params.id,
    createdBy: req.user._id,
  });
  if (!event) throw new ApiError(404, "Event Not Found");
  clearEventCache();
  clearMyEventsCache(req.user._id);
  return res.json(new ApiResponse(200, event, "Event created"));
});

export const joinEvent = asyncHandler(async (req: Request, res: Response) => {
  const eventId = req.params.id;
  const userId = req.user._id as unknown as ObjectId;

  const event = await Event.findById(eventId);

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  if (event.joinedUsers.includes(userId)) {
    throw new ApiError(400, "You have already joined this event");
  }

  const updatedEvent = await Event.findByIdAndUpdate(
    eventId,
    {
      $inc: { attendeeCount: 1 },
      $addToSet: { joinedUsers: userId },
    },
    { new: true }
  ).populate({ path: "createdBy", select: "name _id" });

  return res
    .status(200)
    .json(new ApiResponse(200, updatedEvent, "Successfully joined the event"));
});

export const getMyEvents = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user._id.toString();
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const cacheKey = `my_events_${userId}_page_${page}_limit_${limit}`;
  const cached = cache.get(cacheKey);

  if (cached) {
    return res.json(new ApiResponse(200, cached, "Fetched from cache"));
  }

  const total = await Event.countDocuments({ createdBy: userId });

  const events = await Event.find({ createdBy: userId })
    .sort({ datetime: -1 })
    .skip(skip)
    .limit(limit);

  const result = {
    total,
    page,
    limit,
    events,
  };

  cache.set(cacheKey, result);
  return res.json(new ApiResponse(200, result, "Fetched successfully"));
});
