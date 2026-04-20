export const goalSwaggerDocs = {
  "/api/goal": {
    post: {
      tags: ["goal"],
      summary: "Create a new study goal",
      description:
        "This is auto-generated API documentation for creating a goal",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: [
                "goalName",
                "studyHoursPerDay",
                "startDate",
                "endDate",
                "selectedSubjects",
              ],
              properties: {
                goalName: {
                  type: "string",
                  example: "Complete Anatomy & Physiology",
                },
                studyHoursPerDay: { type: "number", example: 3 },
                startDate: { type: "string", example: "2025-01-01" },
                endDate: { type: "string", example: "2025-03-30" },
                selectedSubjects: {
                  type: "array",
                  example: [
                    {
                      subjectName: "Anatomy",
                      systemNames: ["Nervous System", "Digestive System"],
                    },
                    {
                      subjectName: "Physiology",
                      systemNames: ["Cardiovascular System"],
                    },
                  ],
                },
              },
            },
          },
        },
      },
      responses: {
        201: { description: "Goal created successfully" },
        400: { description: "Validation error" },
      },
    },
    get: {
      tags: ["goal"],
      summary: "Get goals",
      description: "It's automatically calculate all statistics of goals.",
      responses: {
        201: { description: "Goal fetched successfully" },
        400: { description: "Validation error" },
      },
    },
    put: {
      tags: ["goal"],
      summary: "Update a study goal",
      description: "Pass all the valid fields to update a goal",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: [
                "goalName",
                "studyHoursPerDay",
                "startDate",
                "endDate",
                "selectedSubjects",
              ],
              properties: {
                goalName: {
                  type: "string",
                  example: "Complete Anatomy & Physiology",
                },
                studyHoursPerDay: { type: "number", example: 3 },
                startDate: { type: "string", example: "2025-01-01" },
                endDate: { type: "string", example: "2025-03-30" },
                selectedSubjects: {
                  type: "array",
                  example: [
                    {
                      subjectName: "Anatomy",
                      systemNames: ["Nervous System", "Digestive System"],
                    },
                    {
                      subjectName: "Physiology",
                      systemNames: ["Cardiovascular System"],
                    },
                  ],
                },
              },
            },
          },
        },
      },
      responses: {
        201: { description: "Goal updated successfully" },
        400: { description: "Validation error" },
      },
    },
    delete: {
      tags: ["goal"],
      summary: "Delete a study goal",
      description: "Delete a goal",
      responses: {
        201: { description: "Goal delete successfully" },
        400: { description: "Validation error" },
      },
    },
  },
  "/api/goal/update-progress-mcq-flashcard-clinicalcase": {
    put: {
      tags: ["goal"],
      summary: "Update progress of mcq flashcard",
      description:
        "Update progress of mcq flashcard  || key must be mcq || flashcard || clinicalcase",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                totalCorrect: { type: "number", example: 10 },
                totalIncorrect: { type: "number", example: 10 },
                totalAttempted: { type: "number", example: 10 },
                key: { type: "string", example: "mcq" },
                bankId: { type: "string", example: "67890" },
              },
            },
          },
        },
      },
      responses: {
        201: { description: "Goal updated successfully" },
        400: { description: "Validation error" },
      },
    },
  },
  "/api/goal/update-progress-osce": {
    put: {
      tags: ["goal"],
      summary: "Update progress of osce",
      description: "Update progress of osce",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                osceId: { type: "string", example: "67890" },
                totalCorrect: { type: "number", example: 10 },
                totalIncorrect: { type: "number", example: 10 },
                totalAttempted: { type: "number", example: 10 },
              },
            },
          },
        },
      },
      responses: {
        201: { description: "Goal updated successfully" },
        400: { description: "Validation error" },
      },
    },
  },
  "/api/goal/overview": {
    get: {
      tags: ["goal"],
      summary: "Get overview of goals",
      description: "Get overview of goals",
      responses: {
        201: { description: "Goal updated successfully" },
        400: { description: "Validation error" },
      },
    },
  },
};
