export const paymentSwaggerDocs = {
  "/api/payment/initiate": {
    post: {
      tags: ["Payment"],
      summary: "Initiate a payment",
      description: "API to initiate a payment , pass planId",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                planId: {
                  type: "string",
                  example: "xxxxxxxxxxxxxxxxxxxxxxxxxx",
                },
              },
              required: ["planId"],
            },
          },
        },
      },
      responses: {
        200: { description: "payment initiated successfully" },
        400: { description: "Validation error" },
      },
    },
  },
  "/api/payment/verify": {
    post: {
      tags: ["Payment"],
      summary: "Verify a payment",
      description: "API to verify a payment , pass order payload",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                paymentId: { type: "string", example: "order123" },
              },
              required: ["paymentId"],
            },
          },
        },
      },
      responses: {
        200: { description: "payment verified successfully" },
        400: { description: "Validation error" },
      },
    },
  },
  "/api/payment/overview": {
    get: {
      tags: ["Payment"],
      summary: "Get Transaction Overview  - (Only For Admin)",
      description: "API to verify a payment , pass order payload",
      responses: {
        200: { description: "Transaction overview fetched successfully" },
        401: { description: "Unauthorized" },
      },
    },
  },
  "/api/payment/subscribers": {
    get: {
      tags: ["Payment"],
      summary: "Get Transaction Overview  - (Only For Admin)",
      description: "API to verify a payment , pass order payload",
      parameters: [
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
        200: { description: "Transactions fetched successfully" },
        401: { description: "Unauthorized" },
      },
    },
  },
  "/api/payment/subscriber/delete/{paymentId}": {
    delete: {
      tags: ["Payment"],
      summary: "Get Transaction Overview  - (Only For Admin)",
      description: "API to verify a payment , pass order payload",
      parameters: [
        {
          name: "paymentId",
          in: "path",
          schema: { type: "string" },
          require: true,
        },
      ],
      responses: {
        200: { description: "Transaction history delete successfully" },
        401: { description: "Unauthorized" },
      },
    },
  },
};
