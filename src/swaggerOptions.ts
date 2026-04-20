import path from "path";
import { configs } from "./app/configs";
import { adminSwaggerDoc } from "./app/modules/admin/admin.swagger";
import { ai_partSwaggerDocs } from "./app/modules/ai_part/ai_part.swagger";
import { analyticsSwaggerDocs } from "./app/modules/analytics/analytics.swagger";
import { authDocs } from "./app/modules/auth/auth.swagger";
import { awsSwaggerDocs } from "./app/modules/aws/aws.swagger";
import { clinicalCaseSwagger } from "./app/modules/clinical_case/clinical_case.swagger";
import { eventsSwaggerDocs } from "./app/modules/events/events.swagger";
import { examSwaggerDocs } from "./app/modules/exam/exam.swagger";
import { faqSwaggerDocs } from "./app/modules/faq/faq.swagger";
import { flashCardSwaggerDoc } from "./app/modules/flash_card/flash_card.swagger";
import { goalSwaggerDocs } from "./app/modules/goal/goal.swagger";
import { groupSwaggerDocs } from "./app/modules/group/group.swagger";
import { group_messageSwaggerDocs } from "./app/modules/group_message/group_message.swagger";
import { mcqBankSwaggerDoc } from "./app/modules/mcq_bank/mcq_bank.swagger";
import { mentorSwaggerDocs } from "./app/modules/mentor/mentor.swagger";
import { my_contentSwaggerDocs } from "./app/modules/my_content/my_content.swagger";
import { notesSwaggerDocs } from "./app/modules/notes/notes.swagger";
import { osceSwaggerDocs } from "./app/modules/osce/osce.swagger";
import { paymentSwaggerDocs } from "./app/modules/payment/payment.swagger";
import { pricing_planSwaggerDocs } from "./app/modules/pricing_plan/pricing_plan.swagger";
import { profile_type_constSwaggerDocs } from "./app/modules/profile_type_const/profile_type_const.swagger";
import { reportSwaggerDocs } from "./app/modules/report/report.swagger";
import { resourceSwaggerDocs } from "./app/modules/resource/resource.swagger";
import { sessionsSwaggerDocs } from "./app/modules/sessions/sessions.swagger";
import { socialPostDocs } from "./app/modules/social_post/social_post.swagger";
import { studyModeTreeSwaggerDocs } from "./app/modules/study_mode_tree/study_mode_tree.swagger";
import { study_plannerSwaggerDocs } from "./app/modules/study_planner/study_planner.swagger";
import { trackingSwaggerDocs } from "./app/modules/tracking/tracking.swagger";
import { web_settingSwaggerDocs } from "./app/modules/web_setting/web_setting.swagger";

export const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Zyura-e - Future-Stack",
      version: "v-1.0.0",
      description: "Express API with auto-generated Swagger docs",
    },
    paths: {
      ...authDocs,
      ...adminSwaggerDoc,
      ...clinicalCaseSwagger,
      ...socialPostDocs,
      ...mcqBankSwaggerDoc,
      ...flashCardSwaggerDoc,
      ...studyModeTreeSwaggerDocs,
      ...examSwaggerDocs,
      ...reportSwaggerDocs,
      ...profile_type_constSwaggerDocs,

      ...notesSwaggerDocs,
      ...awsSwaggerDocs,
      ...osceSwaggerDocs,
      ...resourceSwaggerDocs,
      ...pricing_planSwaggerDocs,
      ...faqSwaggerDocs,
      ...eventsSwaggerDocs,
      ...web_settingSwaggerDocs,
      ...goalSwaggerDocs,
      ...ai_partSwaggerDocs,
      ...study_plannerSwaggerDocs,
      ...my_contentSwaggerDocs,
      ...mentorSwaggerDocs,
      ...analyticsSwaggerDocs,
      ...paymentSwaggerDocs,
      ...trackingSwaggerDocs,

      ...group_messageSwaggerDocs,
      ...groupSwaggerDocs,
      ...sessionsSwaggerDocs,
    },
    servers:
      configs.env === "production"
        ? [
            { url: "https://api.zyura-e.com" },
            { url: "http://localhost:5000" },
          ]
        : [
            { url: "http://localhost:1800" },
            { url: "https://api.zyura-e.com" }
          ],
    components: {
      securitySchemes: {
        AuthorizationToken: {
          type: "apiKey",
          in: "header",
          name: "Authorization",
          description: "Put your accessToken here ",
        },
      },
    },
    security: [
      {
        AuthorizationToken: [],
      },
    ],
  },
  apis: [
    path.join(
      __dirname,
      configs.env === "production" ? "./**/*.js" : "./**/*.ts"
    ),
  ],
};
