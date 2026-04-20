export const analyticsSwaggerDocs = {
  "/api/analytics/update-view-count": {
    put: {
      tags: ["Analytics"],
      summary: "Update View Count",
      description: "Pass valid key - mcq || flashcard || clinicalcase || osce",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                contentId: { type: "string", example: "xxxxxxxxxxx" },
                key: { type: "string", example: "mcq" },
              },
            },
          },
        },
      },
      responses: {
        201: { description: "View count updated successfully" },
        400: { description: "Validation error" },
      },
    },
  },
};
