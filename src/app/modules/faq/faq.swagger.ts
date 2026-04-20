export const faqSwaggerDocs = {
  "/api/faq": {
    post: {
      tags: ["faq"],
      summary: "faq create",
      description: "This is auto generated faq create API",
      requestBody: {
        required: true,
        content: {
          "application/json":
          {
            schema: {
              type: "object",
              required: ["name"],
              properties: {
                category: { type: "string", example: "MCQ Bank" },
                question: { type: "string", example: "This is a question" },
                answer: { type: "string", example: "This is an answer" },
              }
            }
          }
        }
      },
      responses: { 201: { description: "faq created successfully" }, 400: { description: "Validation error" } }
    },
    get: {
      tags: ["faq"],
      summary: "faq get all",
      description: "This is auto generated faq get all API",
      responses: { 200: { description: "faq fetched successfully" }, 400: { description: "Validation error" } }
    },
  },
  "/api/faq/{id}": {
    get: {
      tags: ["faq"],
      summary: "faq get single",
      description: "This is auto generated faq get single API",
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      responses: { 200: { description: "faq fetched successfully" }, 400: { description: "Validation error" } }
    },
    put: {
      tags: ["faq"],
      summary: "faq update",
      description: "This is auto generated faq update API",
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      requestBody: {
        required: true,
        content: {
          "application/json":
          {
            schema: {
              type: "object",
              properties: {
                category: { type: "string", example: "MCQ Bank" },
                question: { type: "string", example: "This is a question" },
                answer: { type: "string", example: "This is an answer" },
              }
            }
          }
        }
      },
      responses: { 200: { description: "faq updated successfully" }, 400: { description: "Validation error" } }
    },
    delete: {
      tags: ["faq"],
      summary: "faq delete",
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      description: "This is auto generated faq delete API",
      responses: { 200: { description: "faq deleted successfully" }, 400: { description: "Validation error" } }
    },
  },

};