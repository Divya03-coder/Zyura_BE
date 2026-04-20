export const study_plannerSwaggerDocs = {
  "/api/study_planner/all": {
    get: {
      tags: ["Smart Study Planner"],
      summary: "Get all study plan",
      description: "Only authentic user can access this.",
      responses: {
        200: { description: "Study plan fetched successfully" },
        400: { description: "Validation error" },
      },
    },
  },
  "/api/study_planner/save-progress": {
    put: {
      tags: ["Smart Study Planner"],
      summary: "Save study plan progress",
      description: "Only authentic user can access this.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["planId"],
              properties: {
                planId: { type: "string", example: "xxxxxxxxxxx" },
                day: { type: "number", example: 1 },
                suggest_content: { type: "string", example: "xxxxxxxxxxxxxx" },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Study plan progress saved successfully" },
        400: { description: "Validation error" },
      },
    },
  },
  "/api/study_planner/cancel/{planId}": {
    put: {
      tags: ["Smart Study Planner"],
      summary: "Cancel study plan",
      description: "Only authentic user can access this.",
      parameters: [
        {
          name: "planId",
          in: "path",
          required: true,
          description: "Plan ID",
          example: "xxxxxxxxxxx",
        },
      ],
      responses: {
        200: { description: "Study plan cancelled successfully" },
        400: { description: "Validation error" },
      },
    },
  },
  "/api/study_planner/delete/{planId}": {
    delete: {
      tags: ["Smart Study Planner"],
      summary: "Delete study plan",
      description: "Only authentic user can access this.",
      parameters: [
        {
          name: "planId",
          in: "path",
          required: true,
          description: "Plan ID",
          example: "xxxxxxxxxxx",
        },
      ],
      responses: {
        200: { description: "Study plan deleted successfully" },
        400: { description: "Validation error" },
      },
    },
  },
};
