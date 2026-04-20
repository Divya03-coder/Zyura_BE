import { Request } from "express";
import { Types } from "mongoose";
import { AppError } from "../../utils/app_error";
import { study_planner_model } from "./study_planner.schema";

const get_all_study_plan_from_db = async (req: Request) => {
  const accountId = req?.user?.accountId;
  const result = await study_planner_model
    .find({ accountId })
    .sort("-createdAt")
    .lean();
  return result;
};

const save_study_plan_progress_into_db = async (req: Request) => {
  const { planId, day, suggest_content } = req.body as {
    planId: string;
    day: number;
    suggest_content: string;
  };

  // ✅ Step-1: specific hourly_breakdown item completed = true
  const afterTaskUpdate = await study_planner_model.findOneAndUpdate(
    {
      _id: new Types.ObjectId(planId),
      accountId: req?.user?.accountId,
    },
    {
      $set: {
        "daily_plan.$[d].hourly_breakdown.$[t].isCompleted": true,
      },
    },
    {
      new: true,
      arrayFilters: [
        { "d.day_number": day },
        { "t.suggest_content.contentId": suggest_content },
      ],
    }
  ).lean();

  if (!afterTaskUpdate) {
    throw new AppError("Study plan not found", 404);
  }

  // ✅ Step-2: check if that day's all hourly_breakdown completed
  const targetDay = afterTaskUpdate.daily_plan.find((d) => d.day_number === day);
  if (!targetDay) {
    throw new AppError("Day not found", 404);
  }

  const isDayCompleted =
    targetDay.hourly_breakdown.length > 0 &&
    targetDay.hourly_breakdown.every((task) => task.isCompleted === true);

  // ✅ If all done, update day.isCompleted = true (otherwise false)
  const finalUpdated = await study_planner_model.findOneAndUpdate(
    {
      _id: new Types.ObjectId(planId),
      accountId: req?.user?.accountId,
    },
    {
      $set: {
        "daily_plan.$[d].isCompleted": isDayCompleted,
        status: "completed"
      },

    },
    {
      new: true,
      arrayFilters: [{ "d.day_number": day }],
    }
  ).lean();

  return finalUpdated;
};

const cancel_study_plan_from_db = async (req: Request) => {
  const { planId } = req.params as {
    planId: string;
  };

  const result = await study_planner_model.findOneAndUpdate(
    {
      _id: new Types.ObjectId(planId)
    },
    {
      $set: {
        status: "cancelled",
      },
    },
    {
      new: true,
      upsert: true
    }
  ).lean();

  return result;
};

const delete_study_plan_from_db = async (req: Request) => {
  const { planId } = req.params as {
    planId: string;
  };
  const result = await study_planner_model.findOneAndDelete(
    {
      _id: new Types.ObjectId(planId)
    }
  ).lean();

  return result;
};


export const study_planner_service = {
  get_all_study_plan_from_db,
  save_study_plan_progress_into_db,
  cancel_study_plan_from_db,
  delete_study_plan_from_db
};
