export const sessionsSwaggerDocs = {
  "/api/sessions/book-session": {
    post: {
      tags: ["sessions"],
      summary: "sessions create",
      description: "This is auto generated sessions create API",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                firstName: { type: "string", example: "John" },
                lastName: { type: "string", example: "Doe" },
                email: { type: "string", example: "3rFbM@example.com" },
                issue: { type: "string", example: "3rFbM@example.com" },
                mentorAccountId: {
                  type: "string",
                  example: "xxxxxxxxxxxxxxxx",
                },
                date: { type: "string", example: "08/01/2026" },
                time: { type: "string", example: "9:00 AM" },
                sessionDuration: { type: "string", example: "45 minutes" },
                sessionValue: { type: "number", example: 45 },
              },
            },
          },
        },
      },
      responses: {
        201: { description: "sessions created successfully" },
        400: { description: "Validation error" },
      },
    },
  },
  "/api/sessions/verify-session": {
    post: {
      tags: ["sessions"],
      summary: "Verify Session",
      description: "Verify student session",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                paymentId: { type: "string", example: "xxxxxxxx" },
              },
            },
          },
        },
      },
      responses: {
        201: { description: "sessions verified successfully" },
        400: { description: "Validation error" },
      },
    },
  },
  "/api/sessions/my-upcoming-session": {
    get: {
      tags: ["sessions"],
      summary: "Get my upcoming sessions (Only for student and professional)",
      description: "",
      responses: {
        201: { description: "sessions fetched successfully" },
        400: { description: "Validation error" },
      },
    },
  },
};
