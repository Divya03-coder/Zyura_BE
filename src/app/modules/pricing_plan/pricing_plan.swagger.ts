export const pricing_planSwaggerDocs = {
  "/api/pricing_plan": {
    post: {
      tags: ["Pricing Plan"],
      summary: "pricing_plan create",
      description: "Create a new pricing plan",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["planName", "price", "description", "billingCycle", "userType", "planFeatures"],
              properties: {
                planName: { type: "string", example: "Premium" },
                price: { type: "number", example: 49.99 },
                description: { type: "string", example: "Access to premium features" },
                billingCycle: { type: "string", enum: ["Monthly", "Yearly"], example: "Monthly" },
                userType: { type: "string", example: "Student" },
                planFeatures: {
                  type: "array",
                  items: {
                    type: "object",
                    required: ["featureName", "featureLimit"],
                    properties: {
                      featureName: { type: "string", example: "Storage Space" },
                      featureLimit: { type: "string", example: "10GB" }
                    }
                  },
                  example: [
                    { featureName: "Storage Space", featureLimit: "10GB" },
                    { featureName: "Project Limit", featureLimit: "5 projects" }
                  ]
                }
              }
            }
          }
        }
      },
      responses: {
        201: { description: "pricing plan created successfully" },
        400: { description: "Validation error" }
      }
    },
    get: {
      tags: ["Pricing Plan"],
      summary: "pricing_plan get all",
      description: "Get all pricing plans",
      responses: {
        200: { description: "pricing plan fetched successfully" },
        400: { description: "Validation error" }
      }
    }
  },
  "/api/pricing_plan/{id}": {
    get: {
      tags: ["Pricing Plan"],
      summary: "pricing_plan get single",
      description: "Get a single pricing plan",
      parameters: [
        {
          name: "id",
          in: "path",
          description: "ID of the pricing plan to retrieve",
          required: true,
          schema: { type: "string" }
        }
      ],
      responses: {
        200: { description: "pricing plan fetched successfully" },
        400: { description: "Validation error" }
      }
    },
    patch: {
      tags: ["Pricing Plan"],
      summary: "pricing_plan update",
      description: "Update a pricing plan",
      parameters: [
        {
          name: "id",
          in: "path",
          description: "ID of the pricing plan to update",
          required: true,
          schema: { type: "string" }
        }
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                planName: { type: "string", example: "Premium" },
                price: { type: "number", example: 49.99 },
                description: { type: "string", example: "Access to premium features" },
                billingCycle: { type: "string", enum: ["Monthly", "Yearly"], example: "Monthly" },
                userType: { type: "string", example: "Student" },
                planFeatures: {
                  type: "array",
                  items: {
                    type: "object",
                    required: ["featureName", "featureLimit"],
                    properties: {
                      featureName: { type: "string", example: "Storage Space" },
                      featureLimit: { type: "string", example: "10GB" }
                    }
                  },
                  example: [
                    { featureName: "Storage Space", featureLimit: "10GB" },
                    { featureName: "Project Limit", featureLimit: "5 projects" }
                  ]
                }
              }
            }
          }
        }
      },
      responses: {
        200: { description: "pricing plan updated successfully" },
        400: { description: "Validation error" }
      }
    },
    delete: {
      tags: ["Pricing Plan"],
      summary: "pricing_plan delete",
      description: "Delete a pricing plan",
      parameters: [
        {
          name: "id",
          in: "path",
          description: "ID of the pricing plan to delete",
          required: true,
          schema: { type: "string" }
        }
      ],
      responses: {
        200: { description: "pricing plan deleted successfully" },
        400: { description: "Validation error" }
      }
    }
  }
};
