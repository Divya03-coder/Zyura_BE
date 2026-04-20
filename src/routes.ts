import { Router } from "express";
import adminRouter from "./app/modules/admin/admin.route";
import ai_partRoute from "./app/modules/ai_part/ai_part.route";
import analyticsRoute from "./app/modules/analytics/analytics.route";
import authRoute from "./app/modules/auth/auth.route";
import awsRoute from "./app/modules/aws/aws.route";
import careerResourceRoute from "./app/modules/career_resource/career_resource.route";
import clinical_route from "./app/modules/clinical_case/clinical_case.route";
import eventsRoute from "./app/modules/events/events.route";
import examRoute from "./app/modules/exam/exam.route";
import faqRoute from "./app/modules/faq/faq.route";
import flash_card_router from "./app/modules/flash_card/flash_card.route";
import goalRoute from "./app/modules/goal/goal.route";
import groupRoute from "./app/modules/group/group.route";
import group_messageRoute from "./app/modules/group_message/group_message.route";
import mcqBankRouter from "./app/modules/mcq_bank/mcq_bank.route";
import mentorRoute from "./app/modules/mentor/mentor.route";
import my_contentRoute from "./app/modules/my_content/my_content.route";
import notesRoute from "./app/modules/notes/notes.route";
import osceRoute from "./app/modules/osce/osce.route";
import paymentRoute from "./app/modules/payment/payment.route";
import pricing_planRoute from "./app/modules/pricing_plan/pricing_plan.route";
import profile_type_constRoute from "./app/modules/profile_type_const/profile_type_const.route";
import reportRoute from "./app/modules/report/report.route";
import resourceRoute from "./app/modules/resource/resource.route";
import sessionsRoute from "./app/modules/sessions/sessions.route";
import social_post_router from "./app/modules/social_post/social_post.route";
import studentRoute from "./app/modules/student/student.route";
import study_mode_tree_router from "./app/modules/study_mode_tree/study_mode_tree.route";
import study_plannerRoute from "./app/modules/study_planner/study_planner.route";
import trackingRoute from "./app/modules/tracking/tracking.route";
import web_settingRoute from "./app/modules/web_setting/web_setting.route";

const appRouter = Router();

const moduleRoutes = [
  { path: "/sessions", route: sessionsRoute },
  { path: "/group", route: groupRoute },
  { path: "/group_message", route: group_messageRoute },
  { path: "/tracking", route: trackingRoute },
  { path: "/payment", route: paymentRoute },
  { path: "/analytics", route: analyticsRoute },
  { path: "/mentor", route: mentorRoute },
  { path: "/my_content", route: my_contentRoute },
  { path: "/study_planner", route: study_plannerRoute },
  { path: "/ai_part", route: ai_partRoute },
  { path: "/goal", route: goalRoute },
  { path: "/web_setting", route: web_settingRoute },
  { path: "/events", route: eventsRoute },
  { path: "/faq", route: faqRoute },
  { path: "/pricing_plan", route: pricing_planRoute },
  { path: "/resource", route: resourceRoute },
  { path: "/osce", route: osceRoute },
  { path: "/aws", route: awsRoute },
  { path: "/notes", route: notesRoute },
  { path: "/profile_type_const", route: profile_type_constRoute },
  { path: "/report", route: reportRoute },
  { path: "/exam", route: examRoute },
  { path: "/study_mode_tree", route: study_mode_tree_router },
  { path: "/auth", route: authRoute },
  { path: "/clinical-case", route: clinical_route },
  { path: "/student", route: studentRoute },
  { path: "/social-post", route: social_post_router },
  { path: "/career-resource", route: careerResourceRoute },
  { path: "/flash-card", route: flash_card_router },
  { path: "/mcq-bank", route: mcqBankRouter },
  { path: "/admin", route: adminRouter },
];

moduleRoutes.forEach((route) => appRouter.use(route.path, route.route));
export default appRouter;
