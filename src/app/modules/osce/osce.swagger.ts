export const osceSwaggerDocs = {
  "/api/osce/create": {
    post: {
      tags: ["OSCE"],
      summary: "OSCE create - only for admin",
      description: "Pass all valid data. Note: subtopic and studentType are optional.",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: true,
              properties: {
                name: { type: "string", example: "Shortness of Breath OSCE" },
                description: { type: "string", example: "Shortness of Breath OSCE" },
                scenario: { type: "string", example: "Shortness of Breath OSCE" },
                timeLimit: { type: "string", example: "8 minutes" },
                candidateInstruction: { type: "string", example: "You are asked to assess the patient's breathing." },
                patientInstruction: {
                  type: "string",
                  example: "Act as someone experiencing breathlessness."
                },

                tasks: {
                  type: "array",
                  items: {
                    type: "object",
                    required: ["taskName", "checklistItem"],
                    properties: {
                      taskName: {
                        type: "string",
                        example: "History Taking"
                      },
                      checklistItem: {
                        type: "array",
                        items: { type: "string" },
                        example: ["Ask about onset", "Ask about duration"]
                      }
                    }
                  }
                },

                tutorial: {
                  type: "array",
                  items: { type: "string" },
                  example: [
                    "Explain the procedure",
                    "Wash hands before starting",
                    "Maintain patient comfort"
                  ]
                },

                learningResource: {
                  type: "object",
                  required: ["resourceTitle", "resourceUrl"],
                  properties: {
                    resourceTitle: {
                      type: "string",
                      example: "OSCE Clinical Guide"
                    },
                    resourceUrl: {
                      type: "string",
                      example: "https://example.com/osce-guide"
                    }
                  }
                },

                subject: {
                  type: "string",
                  example: "Medicine"
                },
                system: {
                  type: "string",
                  example: "Respiratory"
                },
                topic: {
                  type: "string",
                  example: "Breathlessness Evaluation"
                },

                subtopic: {
                  type: "string",
                  example: "Acute shortness of breath",
                  nullable: true
                },
                contentFor: {
                  type: "string",
                  example: "student",
                },
                profileType: {
                  type: "string",
                  example: "Nursing Student",
                }
              }
            }
          }
        }
      },
      responses: {
        201: { description: "OSCE created successfully" },
        400: { description: "Validation error" }
      }
    }
  },
  "/api/osce": {
    get: {
      tags: ["OSCE"],
      summary: "Get All osce - only for admin and student",
      description: "Pass all the query for your specific search",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "searchTerm",
          in: "query",
          required: false,
          schema: { type: "string" }
        },
        {
          name: "contentFor",
          in: "query",
          required: false,
          schema: { type: "string" }
        },
        {
          name: "subject",
          in: "query",
          required: false,
          schema: { type: "string" }
        },
        {
          name: "system",
          in: "query",
          required: false,
          schema: { type: "string" }
        },
        {
          name: "topic",
          in: "query",
          required: false,
          schema: { type: "string" }
        },
        {
          name: "subtopic",
          in: "query",
          required: false,
          schema: { type: "string" }
        },
        {
          name: "studentType",
          in: "query",
          required: false,
          schema: { type: "string" }
        },
        {
          name: "page",
          in: "query",
          required: false,
          schema: { type: "integer", default: 1 }
        },
        {
          name: "limit",
          in: "query",
          required: false,
          schema: { type: "integer", default: 10 }
        }
      ],
      responses: {
        201: { description: "OSCE fetched successfully" },
        400: { description: "Validation error" }
      }
    }
  },
  "/api/osce/{osceId}": {
    get: {
      tags: ["OSCE"],
      summary: "Get single osce - only for admin and student",
      description: "Pass valid osceId for specific search",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "osceId",
          in: "path",
          required: true,
          schema: { type: "string" }
        }
      ],
      responses: {
        201: { description: "OSCE fetched successfully" },
        400: { description: "Validation error" }
      }
    },
    patch: {
      tags: ["OSCE"],
      summary: "OSCE update - only for admin",
      description: "Pass all valid data",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "osceId",
          in: "path",
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
                name: { type: "string", example: "Shortness of Breath OSCE" },
                description: {
                  type: "string",
                  example: "Shortness of Breath OSCE"
                },
                scenario: { type: "string", example: "Shortness of Breath OSCE" },
                timeLimit: { type: "string", example: "8 minutes" },
                candidateInstruction: { type: "string", example: "You are asked to assess the patient's breathing." },
                patientInstruction: {
                  type: "string",
                  example: "Act as someone experiencing breathlessness."
                },

                tasks: {
                  type: "array",
                  items: {
                    type: "object",
                    required: ["taskName", "checklistItem"],
                    properties: {
                      taskName: {
                        type: "string",
                        example: "History Taking"
                      },
                      checklistItem: {
                        type: "array",
                        items: { type: "string" },
                        example: ["Ask about onset", "Ask about duration"]
                      }
                    }
                  }
                },

                tutorial: {
                  type: "array",
                  items: { type: "string" },
                  example: [
                    "Explain the procedure",
                    "Wash hands before starting",
                    "Maintain patient comfort"
                  ]
                },

                learningResource: {
                  type: "object",
                  required: ["resourceTitle", "resourceUrl"],
                  properties: {
                    resourceTitle: {
                      type: "string",
                      example: "OSCE Clinical Guide"
                    },
                    resourceUrl: {
                      type: "string",
                      example: "https://example.com/osce-guide"
                    }
                  }
                },

                subject: {
                  type: "string",
                  example: "Medicine"
                },
                system: {
                  type: "string",
                  example: "Respiratory"
                },
                topic: {
                  type: "string",
                  example: "Breathlessness Evaluation"
                },

                subtopic: {
                  type: "string",
                  example: "Acute shortness of breath",
                  nullable: true
                },

                studentType: {
                  type: "string",
                  example: "Medical Student",
                  nullable: true
                }
              }
            }
          }
        }
      },
      responses: {
        201: { description: "OSCE update successfully" },
        400: { description: "Validation error" }
      }
    },
    delete: {
      tags: ["OSCE"],
      summary: "Delete single osce - only for admin",
      description: "Pass valid osceId for specific search",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "osceId",
          in: "path",
          required: true,
          schema: { type: "string" }
        }
      ],
      responses: {
        201: { description: "OSCE delete successfully" },
        400: { description: "Validation error" }
      }
    },
  }
};
