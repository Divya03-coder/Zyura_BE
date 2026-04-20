export const resourceSwaggerDocs = {
  "/api/resource/career": {
    post: {
      tags: ["Resource - (Career)"],
      summary: "resource create",
      description: "This API creates a new resource with data + file upload.",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                data: {
                  type: "string",
                  example: JSON.stringify({
                    resourceName: "Shortness of Breath OSCE",
                    category: "OSCE",
                    description: "Shortness of Breath OSCE",
                    tags: ["OSCE", "Breathlessness"]
                  })
                },
                file: {
                  type: "string",
                  format: "binary",
                  description: "Upload file (PDF, Image, etc.)"
                }
              },
              required: ["data", "file"]
            }
          }
        }
      },
      responses: {
        201: { description: "New resource created successfully" },
        400: { description: "Validation error" }
      }
    },
    get: {
      tags: ["Resource - (Career)"],
      summary: "Get all career resource",
      description: "Get all resource for only authenticated user",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "searchTerm",
          in: "query",
          schema: { type: "string" },
          required: false
        },
        {
          name: "category",
          in: "query",
          schema: { type: "string" },
          required: false
        },
        {
          name: "page",
          in: "query",
          schema: { type: "integer" },
          default: 1,
          required: false
        },
        {
          name: "limit",
          in: "query",
          schema: { type: "integer" },
          default: 10,
          required: false
        }
      ],
      responses: {
        201: { description: "All career resource fetched successfully" },
        400: { description: "Validation error" }
      }
    },
  },
  "/api/resource/career/{id}": {
    get: {
      tags: ["Resource - (Career)"],
      summary: "Get single career resource",
      description: "Get all resource for only authenticated user",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          schema: { type: "string" },
          required: true
        },
      ],
      responses: {
        201: { description: "Career resource fetched successfully" },
        400: { description: "Validation error" }
      }
    },
    patch: {
      tags: ["Resource - (Career)"],
      summary: "Update career resource",
      description: "all fields are optional",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          schema: { type: "string" },
          required: true
        }
      ],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                data: {
                  type: "string",
                  example: JSON.stringify({
                    resourceName: "Shortness of Breath OSCE",
                    category: "OSCE",
                    description: "Shortness of Breath OSCE",
                    tags: ["OSCE", "Breathlessness"]
                  })
                },
                file: {
                  type: "string",
                  format: "binary",
                  description: "Upload file (PDF, Image, etc.)"
                }
              }
            }
          }
        }
      },
      responses: {
        201: { description: "Career resource updated successfully" },
        400: { description: "Validation error" }
      }
    },
    delete: {
      tags: ["Resource - (Career)"],
      summary: "Delete single career resource",
      description: "Provide a valid id",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          schema: { type: "string" },
          required: true
        },
      ],
      responses: {
        201: { description: "Career resource delete successfully" },
        400: { description: "Validation error" }
      }
    },
  },

  // books part
  "/api/resource/books": {
    post: {
      tags: ["Resource - (Books)"],
      summary: "Upload new books - Only Admin",
      description: "Upload valid paf + valid data",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                data: {
                  type: "string",
                  example: JSON.stringify({
                    title: "English for Professionals",
                    author: "Dr. John Doe",
                    language: "English",
                    description: "English made easy for professionals",
                    tags: ["OSCE", "Breathlessness"]
                  })
                },
                file: {
                  type: "string",
                  format: "binary",
                  description: "Upload file (PDF, Image, etc.)"
                }
              },
              required: ["data", "file"]
            }
          }
        }
      },
      responses: {
        201: { description: "New book uploaded successfully" },
        400: { description: "Validation error" }
      }
    },
    get: {
      tags: ["Resource - (Books)"],
      summary: "Get all Books",
      description: "Get all books for only authenticated user",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "searchTerm",
          in: "query",
          schema: { type: "string" },
          required: false
        },
        {
          name: "page",
          in: "query",
          schema: { type: "integer" },
          default: 1,
          required: false
        },
        {
          name: "limit",
          in: "query",
          schema: { type: "integer" },
          default: 10,
          required: false
        }
      ],
      responses: {
        201: { description: "All books fetched successfully" },
        400: { description: "Validation error" }
      }
    },
  },
  "/api/resource/books/{id}": {
    get: {
      tags: ["Resource - (Books)"],
      summary: "Get single Book",
      description: "Pass a valid book id",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          schema: { type: "string" },
          required: true
        },
      ],
      responses: {
        201: { description: "Book fetched successfully" },
        400: { description: "Validation error" }
      }
    },
    patch: {
      tags: ["Resource - (Books)"],
      summary: "Update Book",
      description: "all fields are optional, pass a valid book id",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          schema: { type: "string" },
          required: true
        }
      ],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                data: {
                  type: "string",
                  example: JSON.stringify({
                    title: "English for Professionals",
                    author: "Dr. John Doe",
                    language: "English",
                    description: "English made easy for professionals",
                    tags: ["OSCE", "Breathlessness"]
                  })
                },
                file: {
                  type: "string",
                  format: "binary",
                  description: "Upload file (PDF, Image, etc.)"
                }
              }
            }
          }
        }
      },
      responses: {
        201: { description: "Book updated successfully" },
        400: { description: "Validation error" }
      }
    },
    delete: {
      tags: ["Resource - (Books)"],
      summary: "Delete Book",
      description: "Provide a valid id",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          schema: { type: "string" },
          required: true
        },
      ],
      responses: {
        201: { description: "Book delete successfully" },
        400: { description: "Validation error" }
      }
    },
  },


};
