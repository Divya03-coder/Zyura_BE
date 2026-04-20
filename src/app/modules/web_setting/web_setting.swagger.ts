export const web_settingSwaggerDocs = {
  "/api/web_setting": {
    post: {
      tags: ["web_setting"],
      summary: "Create Web Setting - Create + Update only admin",
      description: "Create or update web settings (platform logo & favicon upload supported)",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: [
                "platformName",
                "tagline",
                "description",
                "primaryColor",
                "accentColor",
                "supportEmail",
                "websiteURL"
              ],
              properties: {
                platformName: {
                  type: "string",
                  example: "Zyure AI Platform"
                },
                tagline: {
                  type: "string",
                  example: "Empowering your future"
                },
                description: {
                  type: "string",
                  example: "A modern AI-powered learning platform."
                },
                platformLogo: {
                  type: "string",
                  example: "https://example.com/logo.png"
                },
                favicon: {
                  type: "string",
                  example: "https://example.com/favicon.png"
                },
                primaryColor: {
                  type: "string",
                  example: "#1A73E8"
                },
                accentColor: {
                  type: "string",
                  example: "#FF5722"
                },
                supportEmail: {
                  type: "string",
                  example: "support@zyure.ai"
                },
                websiteURL: {
                  type: "string",
                  example: "https://zyure.ai"
                }
              }
            }
          }
        }
      },
      responses: {
        201: {
          description: "Web setting created successfully"
        },
        400: {
          description: "Validation error"
        }
      }
    },
    get: {
      tags: ["web_setting"],
      summary: "Get Web Setting",
      description: "Fetch the current web settings",
      responses: {
        201: {
          description: "Web setting fetched successfully"
        },
        400: {
          description: "Validation error"
        }
      }
    }
  }
};
