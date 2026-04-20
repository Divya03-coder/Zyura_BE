export const socialPostDocs = {
  "/api/social-post": {
    post: {
      tags: ["Social Post"],
      summary: "Create a new social post",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                image: { type: "string", format: "binary" },
                data: {
                  type: "string",
                  description: "JSON string of social post data",
                  example: {
                    topic: "Biology",
                    content: "Hello this is test post",
                  },
                },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Social post created successfully" },
      },
    },
    get: {
      tags: ["Social Post"],
      summary: "Get all social posts",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "searchTerm",
          in: "query",
          required: false,
          schema: { type: "string" },
        },
      ],
      responses: {
        200: { description: "List of social posts" },
      },
    },
  },
  "/api/social-post/{postId}": {
    get: {
      tags: ["Social Post"],
      summary: "Get a single social post by ID with share count",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "postId",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        200: { description: "Single social post data" },
      },
    },
    patch: {
      tags: ["Social Post"],
      summary: "Update a social post",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "postId",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                image: { type: "string", format: "binary" },
                data: {
                  type: "string",
                  description: "JSON string of updated social post data",
                  example: {
                    topic: "Biology",
                    content: "Hello this is test post",
                  },
                },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Social post updated successfully" },
      },
    },
    delete: {
      tags: ["Social Post"],
      summary: "Delete a social post by ID",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "postId",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        200: { description: "Social post deleted successfully" },
      },
    },
    put: {
      tags: ["Social Post"],
      summary: "Save or update reactions on a social post",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "postId",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        200: { description: "Reaction saved successfully" },
      },
    },
  },
  "/api/social-post/comment/{postId}": {
    put: {
      tags: ["Social Post"],
      summary: "Save a comment on a social post",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "postId",
          in: "path",
          required: true,
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
                comment: {
                  type: "string",
                  example: "This is my comment",
                },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Comment saved successfully" },
      },
    },
  },
  "/api/social-post/question/post": {
    post: {
      tags: ["Social Question Post"],
      summary:
        "Send a question to a mentor - (Only for student and professional)",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                question: {
                  type: "string",
                  example: "How can i learn biology?",
                },
                mentorAccountId: {
                  type: "string",
                  example: "1234567890",
                },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Comment saved successfully" },
      },
    },
  },
  "/api/social-post/question/get-all-mentors-question-with-answers/{mentorId}":
    {
      get: {
        tags: ["Social Question Post"],
        summary:
          "Get all questions from a mentor with answers - (Only for student and professional)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "mentorId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Single question data" },
        },
      },
    },
  "/api/social-post/question/post-answer/{postId}": {
    patch: {
      tags: ["Social Question Post"],
      summary: "Answer a question - (Only for mentor)",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "questionId",
          in: "path",
          required: true,
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
                answer: {
                  type: "string",
                  example: "Answer to the question",
                },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Question answer saved successfully" },
      },
    },
  },
  // forum post
  "/api/social-post/forum/post": {
    post: {
      tags: ["Forum Post"],
      summary: "Create a new forum post",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                title: {
                  type: "string",
                  example: "This is test forum post",
                },
                category: {
                  type: "string",
                  example: "Biology",
                },
                content: {
                  type: "string",
                  example: "Hello this is test forum post",
                },
                tags: {
                  type: "array",
                  items: {
                    type: "string",
                    example: "biology",
                  },
                },
              },
            },
          },
        },
      },
      responses: {
        201: { description: "Forum post created successfully" },
      },
    },
  },
  "/api/social-post/forum/get-all": {
    get: {
      tags: ["Forum Post"],
      summary: "Get all forum posts",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "page",
          in: "query",
          required: false,
          schema: { type: "integer", default: 1 },
        },
        {
          name: "limit",
          in: "query",
          required: false,
          schema: { type: "integer", default: 10 },
        },
        {
          name: "category",
          in: "query",
          required: false,
          schema: { type: "string" },
        },
        {
          name: "searchTerm",
          in: "query",
          required: false,
          schema: { type: "string" },
        },
      ],
      responses: {
        201: { description: "Forum post fetched successfully" },
      },
    },
  },
  "/api/social-post/forum/get-single/{postId}": {
    get: {
      tags: ["Forum Post"],
      summary: "Get forum post by ID",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "postId",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        201: { description: "Forum post fetched successfully" },
      },
    },
  },
  "/api/social-post/forum/comment/{postId}": {
    patch: {
      tags: ["Forum Post"],
      summary: "Write a comment on a forum post",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "postId",
          in: "path",
          required: true,
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
                comment: {
                  type: "string",
                  example: "This is a comment",
                },
              },
            },
          },
        },
      },
      responses: {
        201: { description: "Forum post fetched successfully" },
      },
    },
  },
};
