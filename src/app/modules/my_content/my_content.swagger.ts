export const my_contentSwaggerDocs = {
  "/api/my_content/mcqs": {
    get: {
      tags: ["My Content"],
      summary: "Get all generated mcqs",
      description: "pass all valid query ",
      parameters: [
        {
          name: "searchTerm",
          in: "query",
          schema: { type: "string" },
          require: false,
        },
        {
          name: "subject",
          in: "query",
          schema: { type: "string" },
          require: false,
        },
        {
          name: "system",
          in: "query",
          schema: { type: "string" },
          require: false,
        },
        {
          name: "topic",
          in: "query",
          schema: { type: "string" },
          require: false,
        },
        {
          name: "subtopic",
          in: "query",
          schema: { type: "string" },
          require: false,
        },
        {
          name: "page",
          in: "query",
          schema: { type: "integer", default: 1 },
          require: false,
        },
        {
          name: "limit",
          in: "query",
          schema: { type: "integer", default: 10 },
          require: false,
        },
      ],
      responses: {
        200: { description: "Fetched successfully" },
        400: { description: "Validation error" },
      },
    },
  },
  "/api/my_content/mcqs/{id}": {
    get: {
      tags: ["My Content"],
      summary: "Get single generated mcqs",
      description: "pass valid id ",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "MCQ Bank ID",
          schema: { type: "string" },
        },
      ],
      responses: {
        200: { description: "Fetched successfully" },
        400: { description: "Validation error" },
      },
    },
  },
  "/api/my_content/flashcard": {
    get: {
      tags: ["My Content"],
      summary: "Get all generated flashcards",
      description: "pass all valid query ",
      parameters: [
        {
          name: "searchTerm",
          in: "query",
          schema: { type: "string" },
          require: false,
        },
        {
          name: "subject",
          in: "query",
          schema: { type: "string" },
          require: false,
        },
        {
          name: "system",
          in: "query",
          schema: { type: "string" },
          require: false,
        },
        {
          name: "topic",
          in: "query",
          schema: { type: "string" },
          require: false,
        },
        {
          name: "subtopic",
          in: "query",
          schema: { type: "string" },
          require: false,
        },
        {
          name: "page",
          in: "query",
          schema: { type: "integer", default: 1 },
          require: false,
        },
        {
          name: "limit",
          in: "query",
          schema: { type: "integer", default: 10 },
          require: false,
        },
      ],
      responses: {
        200: { description: "Fetched successfully" },
        400: { description: "Validation error" },
      },
    },
  },
  "/api/my_content/flashcard/{id}": {
    get: {
      tags: ["My Content"],
      summary: "Get single generated flashcard",
      description: "pass valid id ",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "Flashcard ID",
          schema: { type: "string" },
        },
      ],
      responses: {
        200: { description: "Fetched successfully" },
        400: { description: "Validation error" },
      },
    },
  },
  "/api/my_content/clinical-case": {
    get: {
      tags: ["My Content"],
      summary: "Get all generated clinical cases",
      description: "pass all valid query ",
      parameters: [
        {
          name: "searchTerm",
          in: "query",
          schema: { type: "string" },
          require: false,
        },
        {
          name: "subject",
          in: "query",
          schema: { type: "string" },
          require: false,
        },
        {
          name: "system",
          in: "query",
          schema: { type: "string" },
          require: false,
        },
        {
          name: "topic",
          in: "query",
          schema: { type: "string" },
          require: false,
        },
        {
          name: "subtopic",
          in: "query",
          schema: { type: "string" },
          require: false,
        },
        {
          name: "page",
          in: "query",
          schema: { type: "integer", default: 1 },
          require: false,
        },
        {
          name: "limit",
          in: "query",
          schema: { type: "integer", default: 10 },
          require: false,
        },
      ],
      responses: {
        200: { description: "Fetched successfully" },
        400: { description: "Validation error" },
      },
    },
  },
  "/api/my_content/clinical-case/{id}": {
    get: {
      tags: ["My Content"],
      summary: "Get single generated clinical case",
      description: "pass valid id ",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "Clinical Case ID",
          schema: { type: "string" },
        },
      ],
      responses: {
        200: { description: "Fetched successfully" },
        400: { description: "Validation error" },
      },
    },
  },
  "/api/my_content/update-tracking/{id}": {
    put: {
      tags: ["My Content"],
      summary: "Update tracking",
      description: "pass valid id ",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "MCQ Bank ID",
          schema: { type: "string" },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                totalMcqCount: { type: "number" },
                totalAttemptCount: { type: "number" },
                correctMcqCount: { type: "number" },
                wrongMcqCount: { type: "number" },
                timeTaken: { type: "string" },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Updated successfully" },
        400: { description: "Validation error" },
      },
    },
  },
  "/api/my_content/notes": {
    get: {
      tags: ["My Content"],
      summary: "Get all generated Notes",
      description: "pass all valid query ",
      parameters: [
        {
          name: "searchTerm",
          in: "query",
          schema: { type: "string" },
          require: false,
        },
        {
          name: "page",
          in: "query",
          schema: { type: "integer", default: 1 },
          require: false,
        },
        {
          name: "limit",
          in: "query",
          schema: { type: "integer", default: 10 },
          require: false,
        },
      ],
      responses: {
        200: { description: "Fetched successfully" },
        400: { description: "Validation error" },
      },
    },
  },
  "/api/my_content/notes/{id}": {
    get: {
      tags: ["My Content"],
      summary: "Get single generated Note",
      description: "pass valid id ",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "Note Id",
          schema: { type: "string" },
        },
      ],
      responses: {
        200: { description: "Fetched successfully" },
        400: { description: "Validation error" },
      },
    },
  },
  "/api/my_content/delete/{id}/{key}": {
    delete: {
      tags: ["My Content"],
      summary: "Delete single generated content",
      description: "pass valid id and key",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "Content Id",
          schema: { type: "string" },
        },
        {
          name: "key",
          in: "path",
          required: true,
          schema: {
            type: "string",
            enum: ["mcq", "flashcard", "clinicalcase", "notes"],
          },
        },
      ],
      responses: {
        200: { description: "Fetched successfully" },
        400: { description: "Validation error" },
      },
    },
  },
};
