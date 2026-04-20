import { Request } from "express";
import { ObjectId } from "mongodb";
import { AppError } from "../../utils/app_error";
import { T_Event_Enrolled } from "./events.interface";
import { eventEnrolledModel, events_model } from "./events.schema";

const create_new_events_into_db = async (req: Request) => {
  return await events_model.create(req.body);
};

// -------------------------
// Get All (Pagination + Search)
// -------------------------
const get_all_events_from_db = async (req: Request) => {
  const {
    page = "1",
    limit = "10",
    searchTerm = "",
  } = req.query as {
    page?: string;
    limit?: string;
    searchTerm?: string;
  };

  const skip = (Number(page) - 1) * Number(limit);

  // 🔍 Search Filter
  const searchFilter = searchTerm
    ? {
        $or: [
          { eventTitle: { $regex: searchTerm, $options: "i" } },
          { eventType: { $regex: searchTerm, $options: "i" } },
          { category: { $regex: searchTerm, $options: "i" } },
          { instructor: { $regex: searchTerm, $options: "i" } },
        ],
      }
    : {};

  // 📌 Paginated Events
  const result = await events_model
    .find(searchFilter)
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const total = await events_model.countDocuments(searchFilter);

  // 📌 Fetch ALL events for overview stats
  const allEvents = await events_model.find();

  // 🎯 Total Registered Events
  const totalRegisteredEvents = allEvents.reduce((sum, event) => {
    return sum + (event.totalRegistrations || 0);
  }, 0);

  // 💰 Revenue ONLY from completed events
  const totalRevenueGenerated = allEvents.reduce((sum, event) => {
    if (event.status === "Completed" && event.eventPrice) {
      return sum + event.eventPrice * (event.totalRegistrations || 0);
    }
    return sum;
  }, 0);

  // 🔮 Filter upcoming events
  const upComingEvents = allEvents.filter(
    (event) => event.status === "Up-Coming"
  );

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
      skip,
    },
    result: {
      overview: {
        totalEvents: allEvents.length,
        totalRegisteredEvents,
        totalRevenueGenerated,
        upComingEvents,
      },
      events: result,
    },
  };
};

// -------------------------
// Get Single
// -------------------------
const get_single_event_from_db = async (id: string) => {
  return await events_model.findById(id);
};

// -------------------------
// Update
// -------------------------
const update_event_into_db = async (id: string, payload: Partial<any>) => {
  return await events_model.findByIdAndUpdate(id, payload, {
    new: true,
  });
};

// -------------------------
// Delete
// -------------------------
const delete_event_from_db = async (id: string) => {
  return await events_model.findByIdAndDelete(id);
};

// for enroll

const enroll_event_into_db = async (req: Request) => {
  const payload = req?.body as T_Event_Enrolled;

  // check even exist or not
  const isEventExist = await events_model.findById(payload?.eventId);
  if (!isEventExist) {
    throw new AppError("Event not found", 404);
  }

  // make payment in later
  payload.registeredBy = req?.user?.accountId as any;

  // update total registrations
  await events_model.findByIdAndUpdate(payload.eventId, {
    $inc: { totalRegistrations: 1 },
  });

  const result = await eventEnrolledModel.create(payload);
  return result;
};
const get_my_enrolled_events_from_db = async (req: Request) => {
  const accountId = req?.user?.accountId;
  const objId = new ObjectId(accountId);

  const result = await eventEnrolledModel
    .find({ registeredBy: objId })
    .populate("eventId")
    .lean();

  return result;
};

export const events_service = {
  create_new_events_into_db,
  get_all_events_from_db,
  get_single_event_from_db,
  update_event_into_db,
  delete_event_from_db,
  enroll_event_into_db,
  get_my_enrolled_events_from_db,
};
