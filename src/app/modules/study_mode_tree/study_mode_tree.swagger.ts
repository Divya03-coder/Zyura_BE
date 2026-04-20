
export const studyModeTreeSwaggerDocs = {
    "/api/study_mode_tree/create": {
        post: {
            tags: ["Study Mode Tree -(Admin)"],
            summary: "Create a new Content Management Admin entry",
            security: [{ bearerAuth: [] }],
            description: "Creates a new content management structure including subjects, systems, topics, and subtopics.",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["subjectName", "systems"],
                            example: {
                                subjectName: "Computer Science",
                                systems: [
                                    {
                                        name: "Operating Systems",
                                        topics: [
                                            {
                                                topicName: "Memory Management",
                                                subTopics: ["Paging"]
                                            },
                                            {
                                                topicName: "Process Management",
                                                subTopics: ["Threads"]
                                            }
                                        ]
                                    },
                                    {
                                        name: "Computer Networks",
                                        topics: [
                                            {
                                                topicName: "Network Layers",
                                                subTopics: ["Application Layer"]
                                            },
                                            {
                                                topicName: "Network Protocols",
                                                subTopics: ["TCP/IP"]
                                            }
                                        ]
                                    }
                                ],
                                contentFor: "student",
                                profileType: "Nursing Student"
                            }
                        }
                    }
                }
            },
            responses: {
                201: { description: "ContentManagementAdmin created successfully" },
                400: { description: "Validation error" }
            }
        }
    },
    "/api/study_mode_tree/all": {
        get: {
            tags: ["Study Mode Tree -(Admin)"],
            summary: "Get all Content Management Admin entries",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "contentFor",
                    in: "query",
                    schema: { type: "string" },
                    required: false
                },
                {
                    name: "profileType",
                    in: "query",
                    schema: { type: "string" },
                    required: false
                }
            ],
            description: "Retrieves a list of all content management structures.",
            responses: {
                201: { description: "Data fetched successfully" },
                400: { description: "Internal server error" }
            }
        }
    },
    "/api/study_mode_tree/all-content": {
        get: {
            tags: ["Study Mode Tree -(Admin)"],
            summary: "Get all content by tree slug  -- Key must be -- MCQ, Flashcard, ClinicalCase, OSCE, Notes",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "key",
                    in: "query",
                    required: true,
                    schema: { type: "string", example: "MCQ" }
                },
                {
                    name: "contentFor",
                    in: "query",
                    required: false,
                    schema: { type: "string", example: "student" }
                },
                {
                    name: "profileType",
                    in: "query",
                    required: false,
                    schema: { type: "string", example: "Nursing Student" }
                },
                {
                    name: "searchTerm",
                    in: "query",
                    required: false,
                    schema: { type: "string" }
                },
                {
                    name: "subject",
                    in: "query",
                    required: true,
                    schema: { type: "string" }
                },
                {
                    name: "system",
                    in: "query",
                    schema: { type: "string" }
                },
                {
                    name: "topic",
                    in: "query",
                    schema: { type: "string" }
                },
                {
                    name: "subtopic",
                    in: "query",
                    schema: { type: "string" }
                },
                {
                    name: "page",
                    in: "query",
                    schema: { type: "string", example: "1" }
                },
                {
                    name: "limit",
                    in: "query",
                    schema: { type: "string", example: "10" }
                }
            ],
            description: "Retrieves all data by tree slug",
            responses: {
                201: { description: "Data fetched successfully" },
                400: { description: "Internal server error" }
            }
        }
    },
    "/api/study_mode_tree/update/{treeId}": {
        patch: {
            tags: ["Study Mode Tree -(Admin)"],
            summary: "Update a Content Management tree",
            security: [{ bearerAuth: [] }],
            description: "Updates a content management tree based on the provided tree ID. Please send all existing data + new data.",
            parameters: [
                {
                    name: "treeId",
                    in: "path",
                    required: true,
                    schema: { type: "string" },
                    description: "Provide a content management tree ID"
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["subjectName", "systems"],
                            example: {
                                subjectName: "Computer Science",
                                systems: [
                                    {
                                        name: "Operating Systems",
                                        topics: [
                                            {
                                                topicName: "Memory Management",
                                                subTopics: [
                                                    { subtopicName: "Paging" }
                                                ]
                                            },
                                            {
                                                topicName: "Process Management",
                                                subTopics: [
                                                    { subtopicName: "Threads" }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        name: "Computer Networks",
                                        topics: [
                                            {
                                                topicName: "Network Layers",
                                                subTopics: [
                                                    { subtopicName: "Application Layer" }
                                                ]
                                            },
                                            {
                                                topicName: "Network Protocols",
                                                subTopics: [
                                                    { subtopicName: "TCP/IP" }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        }
                    }
                }
            },
            responses: {
                201: { description: "Content Management tree updated successfully" },
                400: { description: "Validation error" }
            }
        }
    },
    "/api/study_mode_tree/delete/{treeId}": {
        delete: {
            tags: ["Study Mode Tree -(Admin)"],
            summary: "Delete content management tree",
            security: [{ bearerAuth: [] }],
            description: "Deletes a content management tree based on the provided tree ID.",
            parameters: [
                {
                    name: "treeId",
                    in: "path",
                    required: true,
                    schema: { type: "string" },
                    description: "Provide a content management tree ID"
                }
            ],
            responses: {
                201: { description: "Content Management tree deleted successfully" },
                400: { description: "Internal server error" }
            }
        }
    },

}


