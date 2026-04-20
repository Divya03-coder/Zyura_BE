export const clinicalCaseSwagger = {
  "/api/clinical-case/create-new": {
    post: {
      tags: ["Clinical Case"],
      summary: "Create a new clinical case",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                caseTitle: { type: "string" },
                description: { type: "string" },
                scenario: { type: "string" },
                patientPresentation: { type: "string" },
                historyOfPresentIllness: { type: "string" },
                physicalExamination: { type: "string" },
                imaging: { type: "string" },

                laboratoryResults: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      value: { type: "string" }
                    },
                    required: ["name", "value"]
                  }
                },

                diagnosisQuestion: {
                  type: "object",
                  properties: {
                    question: { type: "string" },
                    diagnosisOptions: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          optionName: { type: "string", enum: ["A", "B", "C", "D"] },
                          optionValue: { type: "string" },
                          supportingEvidence: {
                            type: "array",
                            items: { type: "string" }
                          },
                          refutingEvidence: {
                            type: "array",
                            items: { type: "string" }
                          }
                        },
                        required: ["optionName", "optionValue"]
                      }
                    }
                  },
                  required: ["question", "diagnosisOptions"]
                },

                correctOption: {
                  type: "object",
                  properties: {
                    optionName: { type: "string", enum: ["A", "B", "C", "D"] },
                    explanation: { type: "string" }
                  },
                  required: ["optionName", "explanation"]
                },

                difficultyLevel: {
                  type: "string",
                  enum: ["Basic", "Intermediate", "Advanced"]
                },

                mcqs: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      question: { type: "string" },
                      options: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            option: {
                              type: "string",
                              enum: ["A", "B", "C", "D", "E", "F"]
                            },
                            optionText: { type: "string" },
                            explanation: { type: "string" }
                          },
                          required: ["option", "optionText"]
                        }
                      },
                      correctOption: {
                        type: "string",
                        enum: ["A", "B", "C", "D", "E", "F"]
                      }
                    },
                    required: ["question", "options", "correctOption"]
                  }
                },

                subject: { type: "string" },
                system: { type: "string" },
                topic: { type: "string" },
                subtopic: { type: "string" },
                contentFor: { type: "string", example: "student" },
                profileType: { type: "string", example: "Nursing Student" },
              },
              required: [
                "caseTitle",
                "patientPresentation",
                "historyOfPresentIllness",
                "physicalExamination",
                "imaging",
                "diagnosisQuestion",
                "correctOption",
                "difficultyLevel",
                "subject",
                "system",
                "topic"
              ]
            }
          }
        }
      },
      responses: {
        201: { description: "Clinical case created successfully" },
        400: { description: "Validation error" },
        401: { description: "Unauthorized" }
      }
    }
  },
  "/api/clinical-case/upload-bulk": {
    post: {
      tags: ["Clinical Case"],
      summary:
        "Bulk upload clinical cases from Excel (multipart: file + data JSON like MCQ bank)",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              required: ["file", "data"],
              properties: {
                file: { type: "string", format: "binary" },
                data: {
                  type: "string",
                  description:
                    "Required JSON: { subject, system, topic, contentFor, profileType, title (Clinical Case Title from step 1), optional subtopic, optional caseTitle }. Taxonomy and default case title are not read from the sheet; optional column caseTitle per row overrides title for that row.",
                },
              },
            },
          },
        },
      },
      responses: {
        201: { description: "Inserted count and any per-row errors" },
        400: { description: "No valid rows or bad file" },
        401: { description: "Unauthorized" },
      },
    },
  },
  "/api/clinical-case": {
    get: {
      tags: ["Clinical Case"],
      summary: "Get all clinical cases",
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
        200: {
          description: "List of clinical cases",
        },
      },
    },
  },

  "/api/clinical-case/{caseId}": {
    get: {
      tags: ["Clinical Case"],
      summary: "Get a single clinical case",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "caseId",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        200: { description: "Single clinical case" },
      },
    },
    patch: {
      tags: ["Clinical Case"],
      summary: "Update clinical case by ID",
      parameters: [
        {
          name: "caseId",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
      ],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                title: { type: "string", example: "Updated Title" },
                description: { type: "string", example: "Updated description" },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Updated successfully" },
      },
    },
    delete: {
      tags: ["Clinical Case"],
      summary: "Delete clinical case by ID",
      parameters: [
        {
          name: "caseId",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        200: { description: "Deleted successfully" },
      },
    },
  },
};


