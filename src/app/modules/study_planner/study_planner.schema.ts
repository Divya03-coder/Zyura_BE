import { Schema, model } from "mongoose";
import { T_StudyPlanner } from "./study_planner.interface";

export interface IHourlyBreakdown {
  task_type: string;
  description: string;
  duration_hours: number;
  duration_minutes: number;
  suggest_content: {
    contentId: string;
    limit: number;
  };
  isCompleted: boolean;
}
export interface IDailyPlanEntry {
  day_number: number;
  date: string; // ISO date string
  total_hours: number;
  topics: string[];
  hourly_breakdown: IHourlyBreakdown[];
  isCompleted: boolean;
}
const SuggestContentSchema = new Schema({
  contentId: { type: String, },
  limit: { type: Number, },
}, { _id: false });

const HourlyBreakdownSchema = new Schema<IHourlyBreakdown>(
  {
    task_type: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    duration_hours: { type: Number, required: true, min: 0 },
    duration_minutes: { type: Number, required: true, min: 0 },
    suggest_content: { type: SuggestContentSchema, required: false },
    isCompleted: { type: Boolean, default: false },
  },
  { _id: false },
);

const DailyPlanEntrySchema = new Schema<IDailyPlanEntry>(
  {
    day_number: Number,
    date: String,
    total_hours: Number,
    topics: [String],
    hourly_breakdown: [HourlyBreakdownSchema],
    isCompleted: { type: Boolean, default: false },
  },
  { _id: false },
);
const study_planner_schema = new Schema<T_StudyPlanner>(
  {
    accountId: { type: String, required: true },
    plan_summary: String,
    total_days: Number,
    daily_plan: [DailyPlanEntrySchema],
    status: { type: String, enum: ["in_progress", "completed", "cancelled"], default: "in_progress" },
  },
  { timestamps: true, versionKey: false },
);

export const study_planner_model = model("study_planner", study_planner_schema);