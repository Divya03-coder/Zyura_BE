export const trackingSwaggerDocs = {
  "/api/tracking/get-leaderboard": {
    get: {
      tags: ["Tracking"],
      summary: "Get Weekly Leaderboard - (Only for student and professional)",
      description: "",
      responses: {
        201: { description: "Leaderboard fetched successfully" },
        400: { description: "Unauthorized" },
      },
    },
  },
  "/api/tracking/get-performance": {
    get: {
      tags: ["Tracking"],
      summary: "Get My Performance - (Only for student and professional)",
      description: "",
      responses: {
        201: { description: "Leaderboard fetched successfully" },
        400: { description: "Unauthorized" },
      },
    },
  },
  "/api/tracking/get-highlights-content-of-this-week": {
    get: {
      tags: ["Tracking"],
      summary:
        "Get Highlights Content of this week - (Only for student and professional)",
      description: "",
      responses: {
        201: { description: "Leaderboard fetched successfully" },
        400: { description: "Unauthorized" },
      },
    },
  },
  "/api/tracking/daily-challenge": {
    get: {
      tags: ["Tracking"],
      summary:
        "Get Daily Challenge - (Only for student and professional)",
      description: "",
      responses: {
        201: { description: "Challenge fetched successfully" },
        400: { description: "Unauthorized" },
      },
    },
  },
  "/api/tracking/daily-challenge/status": {
    put: {
      tags: ["Tracking"],
      summary:
        "Get Daily Challenge status update - (Only for student and professional)",
      description: "",
      responses: {
        201: { description: "Challenge status update successfully" },
        400: { description: "Unauthorized" },
      },
    },
  },
};
