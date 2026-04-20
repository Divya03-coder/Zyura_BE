export const ai_partSwaggerDocs = {
  "/api/ai_part/ai-tutor": {
    post: {
      tags: ["AI API'S"],
      summary: "Chat with AI Tutor",
      security: [{ bearerAuth: [] }],
      description: "Pass a valid question for ai tutor",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["question"],
              properties: {
                question: { type: "string", example: "How are you?" },
                thread_id: { type: "string", example: "" }
              }
            }
          }
        }
      },
      responses: { 201: { description: "Ai response successfully" }, 400: { description: "Validation error" } }
    },
  },
  "/api/ai_part/ai-tutor/history": {
    get: {
      tags: ["AI API'S"],
      summary: "Get all chat history",
      security: [{ bearerAuth: [] }],
      description: "Get all chat history",
      parameters: [
        {
          name: "thread_id",
          in: "query",
          required: true,
          schema: { type: "string" }
        },
      ],
      responses: { 201: { description: "Ai response successfully" }, 400: { description: "Validation error" } }
    }
  },
  "/api/ai_part/ai-tutor/thread-title": {
    get: {
      tags: ["AI API'S"],
      summary: "Get all Thread title",
      security: [{ bearerAuth: [] }],
      description: "Get all Thread title",
      responses: { 201: { description: "Ai response successfully" }, 400: { description: "Validation error" } }
    }
  },
  "/api/ai_part/create-study-plan": {
    post: {
      tags: ["AI API'S"],
      summary: "Create new study plan",
      security: [{ bearerAuth: [] }],
      description: "Pass all the valid exam plan data",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                exam_name: { type: "string", example: "cardiology" },
                exam_date: { type: "string", example: "2025-10-15" },
                exam_type: { type: "string", example: "mid" },
                daily_study_time: { type: "number", example: 3 },
                topics: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      subject: { type: "string", example: "anatomy" },
                      system: { type: "string", example: "cardiovascular" },
                      topic: { type: "string", example: "hypertension" },
                      subtopic: { type: "string", example: "risk factor" }
                    }
                  }
                }
              }
            }
          }
        }
      },
      responses: {
        201: { description: "Study plan created successfully" },
        400: { description: "Validation error" }
      }
    }
  },
  "/api/ai_part/generate-flashcard": {
    post: {
      tags: ["AI API'S"],
      summary: "Generate flashcard Using AI",
      security: [{ bearerAuth: [] }],
      description: "Send metadata inside a 'data' JSON string and upload a file.",
      requestBody: {
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                // JSON string containing all fields
                data: {
                  type: "object",
                  example: JSON.stringify({
                    quiz_name: "Sample Quiz",
                    subject: "anatomy",
                    system: "cardiovascular",
                    topic: "hypertension",
                    sub_topic: "risk factor",
                    question_type: "hybrid",
                    question_count: "5",
                    difficulty_level: "Basic",
                    user_prompt: "Generate flashcards on hypertension"
                  })
                },

                // File upload
                file: {
                  type: "string",
                  format: "binary",
                  description: "File for AI processing"
                }
              }
            }
          }
        }
      },
      responses: {
        201: { description: "Flashcard created successfully" },
        400: { description: "Validation error" }
      }
    }
  },
  "/api/ai_part/generate-mcq": {
    post: {
      tags: ["AI API'S"],
      summary: "Generate MCQ using AI",
      security: [{ bearerAuth: [] }],
      description: "Pass all the valid data",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                quiz_name: { type: "string", example: "Sample Quiz" },
                subject: { type: "string", example: "anatomy" },
                system: { type: "string", example: "cardiovascular" },
                topic: { type: "string", example: "hypertension" },
                sub_topic: { type: "string", example: "risk factor" },
                question_type: { type: "string", example: "hybrid" },
                question_count: { type: "number", example: 5 },
                difficulty_level: { type: "string", example: "Basic" },
                mcq_bank_id: { type: "string" }
              }
            }
          }
        }
      },
      responses: {
        201: { description: "MCQ generated successfully" },
        400: { description: "Validation error" }
      }
    }
  },
  "/api/ai_part/create_clinical_case": {
    post: {
      tags: ["AI API'S"],
      summary: "Generate Clinical case",
      security: [{ bearerAuth: [] }],
      description: "Pass all the valid data",
      requestBody: {
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                // JSON string containing all fields
                data: {
                  type: "string",
                  example: JSON.stringify({
                    prompt: "Generate Clinical case for a old mane",
                  })
                },

                // File upload
                file: {
                  type: "string",
                  format: "binary",
                  description: "File for AI processing"
                }
              }
            }
          }
        }
      },
      responses: {
        201: { description: "Clinical case created successfully" },
        400: { description: "Validation error" }
      }
    }
  },
  "/api/ai_part/content-suggestion": {
    get: {
      tags: ["AI API'S"],
      summary: "Get all title suggestion for ai",
      security: [{ bearerAuth: [] }],
      description: "Key will be - mcq, flashcard, clinicalcase, osce,notes",
      parameters: [
        {
          name: "key",
          in: "query",
          type: "string",
          example: "mcq"
        }
      ],
      responses: {
        201: { description: "Clinical case created successfully" },
        400: { description: "Validation error" }
      }
    }
  },
  "/api/ai_part/mcq_generator_with_file": {
    post: {
      tags: ["AI API'S"],
      summary: "Generate MCQ using AI with file upload",
      security: [{ bearerAuth: [] }],
      description: "Pass all the valid data",
      requestBody: {
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                // JSON string containing all fields
                data: {
                  type: "object",
                  example: JSON.stringify({
                    prompt: "Generate Clinical case for a old mane",
                    d_level: "Basic",
                    q_count: 5
                  })
                },

                // File upload
                file: {
                  type: "string",
                  format: "binary",
                  description: "File for AI processing"
                }
              }
            }
          }
        }
      },
      responses: {
        201: { description: "Clinical case created successfully" },
        400: { description: "Validation error" }
      }
    }
  },
  "/api/ai_part/generate-note": {
    post: {
      tags: ["AI API'S"],
      summary: "Generate note using AI with file upload",
      security: [{ bearerAuth: [] }],
      description: "Pass all the valid data",
      requestBody: {
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                // JSON string containing all fields
                data: {
                  type: "object",
                  example: JSON.stringify({
                    make_your_note: "Make a exam prep note for using this image",
                    topic_name: "Basic",
                    note_format: "Text"
                  })
                },

                // File upload
                file: {
                  type: "string",
                  format: "binary",
                  description: "File for AI processing"
                }
              }
            }
          }
        }
      },
      responses: {
        201: { description: "Clinical case created successfully" },
        400: { description: "Validation error" }
      }
    }
  },
  "/api/ai_part/generate-recommendation/{contentId}": {
    post: {
      tags: ["AI API'S"],
      summary: "Generate recommendation using AI",
      security: [{ bearerAuth: [] }],
      description: "Pass all the valid data",
      parameters: [
        {
          name: "contentId",
          in: "path",
          required: true,
          schema: { type: "string" }
        },
      ],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              example: JSON.stringify(
                [
                  {
                    mcqId: "string",
                    difficulty: "Basic",
                    question: "string",
                    options: [
                      {
                        option: "A",
                        optionText: "string",
                        explanation: "string"
                      }
                    ],
                    correctOption: "A",
                    userSelectedOption: "A"
                  }
                ]
              )
            }
          }
        }
      },
      responses: {
        201: { description: "Recommendation generated successfully" },
        400: { description: "Validation error" }
      }
    }
  },
};