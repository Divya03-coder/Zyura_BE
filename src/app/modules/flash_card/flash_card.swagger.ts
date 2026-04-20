
export const flashCardSwaggerDoc = {
    "/api/flash-card/bulk-create": {
        post: {
            tags: ["Flash Card"],
            summary: "Upload a bulk of flash cards - Only Admin can upload",
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
                                    description: "Provide a valid data format for MCQs",
                                    example: {
                                        title: "Anatomy Essentials MCQs",
                                        subject: "Neurology",
                                        system: "Anatomy",
                                        topic: "Tonatomy",
                                        subtopic: "Monatomy",
                                        contentFor: "student",
                                        profileType: "Nursing Student"
                                    },
                                },
                                file: {
                                    type: "string",
                                    format: "binary",
                                    description: "Excel file containing MCQ data",
                                },
                            },
                            required: ["data", "file"],
                        },
                    },
                },
            },
            responses: {
                201: { description: "Flash card uploaded successfully" },
                400: { description: "Invalid data format or missing fields" },
                401: { description: "Unauthorized" },
            },
        }
    },
    "/api/flash-card/manual-create": {
        post: {
            tags: ["Flash Card"],
            security: [{ bearerAuth: [] }],
            summary: "Create a new Manual flash card - Only Admin can create",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                title: {
                                    type: "string",
                                    example: "Anatomy Essentials MCQs"
                                },
                                subject: {
                                    type: "string",
                                    example: "Neurology"
                                },
                                system: {
                                    type: "string",
                                    example: "Anatomy"
                                },
                                topic: {
                                    type: "string",
                                    example: "Tonatomy"
                                },
                                subtopic: {
                                    type: "string",
                                    example: "Monatomy"
                                },
                                contentFor: {
                                    type: "string",
                                    example: "student"
                                },
                                profileType: {
                                    type: "string",
                                    example: "Nursing Student"
                                },
                                flashCards: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            frontText: {
                                                type: "string",
                                                example: "Question"
                                            },
                                            image: {
                                                type: "string",
                                                example: "https://example.com/image.jpg"
                                            },
                                            backText: {
                                                type: "string",
                                                example: "Answer"
                                            },
                                            explanation: {
                                                type: "string",
                                                example: "Explanation"
                                            },
                                            difficulty: {
                                                type: "string",
                                                example: "Basic"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                201: { description: "Flash card created successfully" },
                401: { description: "Unauthorized" },
            }
        }
    },
    "/api/flash-card/all": {
        get: {
            tags: ["Flash Card"],
            summary: "Get all flash cards",
            parameters: [
                {
                    name: "searchTerm",
                    in: "query",
                    description: "Search by title",
                    required: false,
                    schema: { type: "string" }
                },
                {
                    name: "contentFor",
                    in: "query",
                    description: "Filter by contentFor- student | teacher",
                    required: false,
                    schema: { type: "string" }
                },
                {
                    name: "subject",
                    in: "query",
                    description: "Filter by subject",
                    required: false,
                    schema: { type: "string" }
                },
                {
                    name: "system",
                    in: "query",
                    description: "Filter by system",
                    required: false,
                    schema: { type: "string" }
                },
                {
                    name: "topic",
                    in: "query",
                    description: "Filter by topic",
                    required: false,
                    schema: { type: "string" }
                },
                {
                    name: "subtopic",
                    in: "query",
                    description: "Filter by subtopic",
                    required: false,
                    schema: { type: "string" }
                },
                {
                    name: "page",
                    in: "query",
                    description: "Page number for pagination (default: 1)",
                    required: false,
                    schema: { type: "integer", example: 1 },
                },
                {
                    name: "limit",
                    in: "query",
                    description: "Number of items per page (default: 10)",
                    required: false,
                    schema: { type: "integer", example: 10 },
                },

            ],
            security: [{ bearerAuth: [] }],
            responses: {
                201: { description: "Flash card fetched successfully" },
                401: { description: "Unauthorized" },
            },
        }
    },
    "/api/flash-card/single/{flashCardId}": {
        get: {
            tags: ["Flash Card"],
            summary: "Get Single Flash card Bank",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "flashCardId",
                    in: "path",
                    required: true,
                    schema: { type: "string" }
                },
                {
                    name: "searchTerm",
                    in: "query",
                    required: false,
                    schema: { type: "string" }
                },
                {
                    name: "difficulty",
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
                201: { description: "Flash card fetched successfully" },
                401: { description: "Unauthorized" },
            },
        }
    },
    "/api/flash-card/specific/{flashCardBankId}/{flashCardId}": {
        get: {
            tags: ["Flash Card"],
            summary: "Get Single Flash card Bank",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "flashCardBankId",
                    in: "path",
                    required: true,
                    schema: { type: "string" }
                },
                {
                    name: "flashCardId",
                    in: "path",
                    required: true,
                    schema: { type: "string" }
                }
            ],
            responses: {
                201: { description: "Flash card fetched successfully" },
                401: { description: "Unauthorized" },
            },
        }
    },
    "/api/flash-card/update/{flashCardBankId}/{flashCardId}": {
        patch: {
            tags: ["Flash Card"],
            summary: "Update a Flash card using FlashcardId - (For Admin)",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "flashCardBankId",
                    in: "path",
                    required: true,
                    schema: { type: "string" }
                },
                {
                    name: "flashCardId",
                    in: "path",
                    required: true,
                    schema: { type: "string" }
                }
            ],
            requestBody: {
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                frontText: { type: "string" },
                                backText: { type: "string" },
                                explanation: { type: "string" },
                                difficulty: { type: "string" },
                            },
                        },
                    },
                },
            },
            responses: {
                201: { description: "Flash card update successfully" },
                401: { description: "Unauthorized" },
            },
        }
    },
    "/api/flash-card/delete/{flashCardBankId}": {
        delete: {
            tags: ["Flash Card"],
            summary: "Delete FlashcardId - (For Admin)",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "flashCardBankId",
                    in: "path",
                    required: true,
                    schema: { type: "string" }
                }
            ],
            responses: {
                201: { description: "Flash card bank delete successfully" },
                401: { description: "Unauthorized" },
            },
        }
    },
    "/api/flash-card/delete-single/{flashCardBankId}/{flashCardId}": {
        delete: {
            tags: ["Flash Card"],
            summary: "Delete FlashcardId - (For Admin)",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "flashCardBankId",
                    in: "path",
                    required: true,
                    schema: { type: "string" }
                },
                {
                    name: "flashCardId",
                    in: "path",
                    required: true,
                    schema: { type: "string" }
                }
            ],
            responses: {
                201: { description: "Flash card bank delete successfully" },
                401: { description: "Unauthorized" },
            },
        }
    },
    "/api/flash-card/upload-more-flash-card/{flashCardBankId}": {
        put: {
            tags: ["Flash Card"],
            summary: "Upload a bulk of flash cards - Only Admin can upload",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "flashCardBankId",
                    in: "path",
                    required: true,
                    schema: { type: "string" }
                },
                {
                    name: "key",
                    in: "query",
                    required: true,
                    description: "key must be - bulk or manual",
                    schema: { type: "string" }
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
                                    type: "object",
                                    description: "Provide a valid data format for each flash card",
                                    example: [
                                        {
                                            frontText: "What is the normal human body temperature?",
                                            backText: "Around 37°C (98.6°F).",
                                            explanation: "The average normal temperature varies slightly among individuals.",
                                            difficulty: "Basic"
                                        }
                                    ],
                                },
                                file: {
                                    type: "string",
                                    format: "binary",
                                    description: "Excel file containing MCQ data",
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                201: { description: "Flash card uploaded successfully" },
                400: { description: "Invalid data format or missing fields" },
                401: { description: "Unauthorized" },
            },
        }
    },
}
