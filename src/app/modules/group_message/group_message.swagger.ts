export const group_messageSwaggerDocs = {
  "/api/group_message/send-message": {
    post: {
      tags: ["Group Message"],
      summary: "Send Group Message",
      description: "Send Group Message || Pass valid group id and message",
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                data: {
                  type: "object",
                  example: {
                    groupId: "6943d760c91737690c462645",
                    message: "Hello",
                    reply: "Hello",
                  }
                },
                file: { type: "string", format: "binary" },
              },
            },
          }
        }
      },
      responses: { 201: { description: "Group message sent successfully" }, 400: { description: "Validation error" } }
    }
  },
  "/api/group_message/get-message/{groupId}": {
    get: {
      tags: ["Group Message"],
      summary: "Get Group Message",
      description: "Get Group Message || Pass valid group id",
      parameters: [
        {
          name: "groupId",
          in: "path",
          required: true,
          description: "Group ID",
          schema: {
            type: "string",
          },
        },
        {
          name: "page",
          in: "query",
          required: false,
          description: "Page number",
          schema: {
            type: "number",
            default: 1,
          },
        },
        {
          name: "limit",
          in: "query",
          required: false,
          description: "Limit number",
          schema: {
            type: "number",
            default: 30,
          },
        }
      ],
      responses: { 201: { description: "Group messages fetched successfully" }, 400: { description: "Validation error" } }
    }
  },
  "/api/group_message/update-reaction/{messageId}": {
    get: {
      tags: ["Group Message"],
      summary: "Update Group Message Reaction",
      description: "Update Group Message Reaction || Pass valid message id",
      parameters: [
        {
          name: "messageId",
          in: "path",
          required: true,
          description: "Message ID",
          schema: {
            type: "string",
          },
        }
      ],
      responses: { 201: { description: "Group message reaction updated successfully" }, 400: { description: "Validation error" } }
    }
  }
};