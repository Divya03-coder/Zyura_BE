export const eventsSwaggerDocs = {
  "/api/events": {
    post: {
      tags: ["events"],
      summary: "Create a new event - (Only for admin and mentor)",
      security: [{ bearerAuth: [] }],
      description: "This API creates a new event entry.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                eventTitle: { type: "string", example: "Live Anatomy Session" },
                eventType: { type: "string", example: "Webinar" },
                eventFormat: { type: "string", example: "Online" },
                category: { type: "string", example: "Medical Education" },
                description: {
                  type: "string",
                  example: "Detailed anatomy class with 3D visuals.",
                },
                eventData: { type: "string", example: "Slides + Zoom Link" },
                startTime: { type: "string", example: "2025-01-15T14:00:00Z" },
                eventDuration: { type: "string", example: "2 hours" },
                instructor: { type: "string", example: "Dr. Emily Carter" },
                eventPrice: { type: "number", nullable: true, example: 25.0 },
                meetingDetails: {
                  type: "string",
                  example: "Zoom: 123-456-789",
                },
              },
            },
          },
        },
      },
      responses: {
        201: { description: "Event created successfully" },
        400: { description: "Validation error" },
      },
    },

    get: {
      tags: ["events"],
      summary: "Get all events - (All valid login user can access)",
      security: [{ bearerAuth: [] }],
      description: "Fetch all events with pagination and search.",
      parameters: [
        {
          in: "query",
          name: "page",
          schema: { type: "integer", example: 1 },
          description: "Page number",
        },
        {
          in: "query",
          name: "limit",
          schema: { type: "integer", example: 10 },
          description: "Number of items per page",
        },
        {
          in: "query",
          name: "searchTerm",
          schema: { type: "string", example: "anatomy" },
          description: "Search keyword",
        },
      ],
      responses: {
        200: { description: "Events fetched successfully" },
      },
    },
  },

  "/api/events/{id}": {
    get: {
      tags: ["events"],
      summary: "Get single event - (All valid login user can access)",
      security: [{ bearerAuth: [] }],
      description: "Fetch event details by ID.",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "Event ID",
        },
      ],
      responses: {
        200: { description: "Event fetched successfully" },
        404: { description: "Event not found" },
      },
    },

    patch: {
      tags: ["events"],
      summary: "Update an event - (Only for admin and mentor)",
      security: [{ bearerAuth: [] }],
      description: "Update event details by ID.",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "Event ID",
        },
      ],
      requestBody: {
        required: false,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                eventTitle: { type: "string", example: "Updated Title" },
                eventType: { type: "string", example: "Workshop" },
                eventFormat: { type: "string", example: "Offline" },
                category: { type: "string", example: "Education" },
                description: {
                  type: "string",
                  example: "Updated event description.",
                },
                eventData: { type: "string", example: "New Materials" },
                startTime: { type: "string", example: "2025-02-01T10:00:00Z" },
                eventDuration: { type: "string", example: "3 hours" },
                instructor: { type: "string", example: "Dr. Sarah Lee" },
                eventPrice: { type: "number", nullable: true, example: 30.0 },
                meetingDetails: {
                  type: "string",
                  example: "Updated Zoom link",
                },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Event updated successfully" },
        404: { description: "Event not found" },
      },
    },

    delete: {
      tags: ["events"],
      summary: "Delete an event - (Only for admin and mentor)",
      security: [{ bearerAuth: [] }],
      description: "Delete event by ID.",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "Event ID",
        },
      ],
      responses: {
        200: { description: "Event deleted successfully" },
        404: { description: "Event not found" },
      },
    },
  },

  "/api/events/enroll": {
    post: {
      tags: ["events"],
      summary: "Enroll in an event - (Only for student and professional)",
      security: [{ bearerAuth: [] }],
      description: "",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                eventId: { type: "string" },
              },
            },
          },
        },
      },
      responses: {
        201: { description: "Event created successfully" },
        400: { description: "Validation error" },
      },
    },
  },
  "/api/events/my-events": {
    get: {
      tags: ["events"],
      summary: "Get my enrolled events - (Only for student and professional)",
      security: [{ bearerAuth: [] }],
      description: "",
      responses: {
        201: { description: "Event created successfully" },
        400: { description: "Validation error" },
      },
    },
  },
};
