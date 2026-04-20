export const mentorSwaggerDocs = {
  "/api/mentor/upload-document": {
    put: {
      tags: ["Mentor API"],
      summary: "Upload documents - for verifying mentor profile",
      description: "Upload any document like - pdf, image",
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                profile_photo: {
                  type: "string",
                  format: "binary",
                },
                degree: {
                  type: "string",
                  format: "binary",
                },
                identity_card: {
                  type: "string",
                  format: "binary",
                },
                certificate: {
                  type: "string",
                  format: "binary",
                },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Documents uploaded successfully" },
        400: { description: "Validation error" },
      },
    },
  },
  "/api/mentor/verify-profession": {
    put: {
      tags: ["Mentor API"],
      summary: "Verify profession - for verifying mentor profile",
      description: "Verify profession - for verifying mentor profile",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                bio: { type: "string", example: "This is the bio of mentor" },
                skills: {
                  type: "array",
                  items: { type: "string" },
                  example: ["Skill 1", "Skill 2"],
                },
                languages: {
                  type: "array",
                  items: { type: "string" },
                  example: ["Language 1", "Language 2"],
                },
                hourlyRate: { type: "number", example: 100 },
                currency: { type: "string", example: "USD" },
                availability: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      day: { type: "string", example: "Monday" },
                      time: {
                        type: "array",
                        items: { type: "string" },
                        example: ["10:00 AM - 11:00 AM"],
                      },
                    },
                  },
                  example: [{ day: "Monday", time: ["10:00 AM - 11:00 AM"] }],
                },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Documents uploaded successfully" },
        400: { description: "Validation error" },
      },
    },
  },
  "/api/mentor/update-payment-information": {
    put: {
      tags: ["Mentor API"],
      summary: "Update payment information - for verifying mentor profile",
      description: "Update payment information - for verifying mentor profile",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                bankInformation: {
                  type: "object",
                  properties: {
                    accountHolderName: { type: "string", example: "John Doe" },
                    bankName: { type: "string", example: "Sonar Bank" },
                    accountNumber: { type: "string", example: "123654522" },
                    routingNumber: { type: "string", example: "123654522" },
                    accountType: { type: "string", example: "Savings" },
                  },
                },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Documents uploaded successfully" },
        400: { description: "Validation error" },
      },
    },
  },
  // Mentor dashboard overview
  "/api/mentor/dashboard/overview": {
    get: {
      tags: ["Mentor API"],
      summary: "Get Dashboard Overview  -(only for Mentor)",
      description: "Pass valid year for filtering",
      parameters: [
        {
          name: "year",
          in: "query",
          required: false,
          schema: { type: "string" },
        },
      ],
      responses: {
        200: { description: "Overview fetched successfully" },
        401: { description: "Unauthorized access" },
      },
    },
  },
  "/api/mentor/dashboard/earnings": {
    get: {
      tags: ["Mentor API"],
      summary: "Get Dashboard Earnings  -(only for Mentor)",
      description: "Pass valid year for filtering",
      parameters: [
        {
          name: "year",
          in: "query",
          required: false,
          schema: { type: "string" },
        },
      ],
      responses: {
        200: { description: "Earnings fetched successfully" },
        401: { description: "Unauthorized access" },
      },
    },
  },
  "/api/mentor/dashboard/transaction": {
    get: {
      tags: ["Mentor API"],
      summary: "Get Dashboard Transaction  -(only for Mentor)",
      description: "Pass valid query",
      parameters: [
        {
          name: "status",
          in: "query",
          required: false,
          schema: { type: "string" },
        },
        {
          name: "page",
          in: "query",
          required: false,
          schema: { type: "number", default: 1 },
        },
        {
          name: "limit",
          in: "query",
          required: false,
          schema: { type: "number", default: 10 },
        },
      ],
      responses: {
        200: { description: "Earnings fetched successfully" },
        401: { description: "Unauthorized access" },
      },
    },
  },
};
