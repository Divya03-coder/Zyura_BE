export type T_StudyPlanner = {
  accountId: string;
  plan_summary: string;
  total_days: number;
  daily_plan: {
    day_number: number;
    date: string;
    total_hours: number;
    topics: string[];
    hourly_breakdown: {
      task_type: string;
      description: string;
      suggest_content: string[];
      duration_hours: number;
      isCompleted: boolean;
    }[];
    isCompleted: boolean;
  }[];
  status: "cancelled" | "completed" | "in_progress";
};
