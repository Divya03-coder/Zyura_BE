export const adminSwaggerDoc = {
    "/api/admin/overview": {
        get: {
            tags: ["Admin Dashboard API"],
            summary: "Get all Overview for admin",
            security: [{ bearerAuth: [] }],
            responses: {
                200: {
                    description: "Data fetched successfully.",
                },
                401: { description: "Unauthorized" },
            },
        },
    },
    "/api/admin/monthly-activities": {
        get: {
            tags: ["Admin Dashboard API"],
            summary: "Get Monthly Activities for admin",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "year",
                    in: "query",
                    required: false,
                    schema: { type: "integer" }
                },
                {
                    name: "month",
                    in: "query",
                    required: false,
                    schema: { type: "integer" }
                }
            ],
            responses: {
                200: {
                    description: "Data fetched successfully.",
                },
                401: { description: "Unauthorized" },
            },
        },
    },
    "/api/admin/students": {
        get: {
            tags: ["Admin Dashboard API"],
            summary: "Get all students for admin",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "search",
                    in: "query",
                    required: false,
                    schema: { type: "string" }
                },
                {
                    name: "year_of_study",
                    in: "query",
                    required: false,
                    schema: { type: "string" }
                },
                {
                    name: "preparingFor",
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
                    description: "Data fetched successfully.",
                },
                401: { description: "Unauthorized" },
            },
        },
    },
    "/api/admin/student/{studentId}": {
        get: {
            tags: ["Admin Dashboard API"],
            summary: "Get student by id",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "studentId",
                    in: "path",
                    required: true,
                    schema: { type: "string" }
                }
            ],
            responses: {
                200: {
                    description: "Student fetched successfully.",
                },
                401: { description: "Unauthorized" },
                404: { description: "Student not found" },
            },
        },
        delete: {
            tags: ["Admin Dashboard API"],
            summary: "Delete student by id",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "studentId",
                    in: "path",
                    required: true,
                    schema: { type: "string" }
                }
            ],
            responses: {
                200: {
                    description: "Student account deleted successfully.",
                },
                401: { description: "Unauthorized" },
                404: { description: "Student not found" },
            },
        },
    },
    "/api/admin/professionals": {
        get: {
            tags: ["Admin Dashboard API"],
            summary: "Get all Professionals for admin",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "search",
                    in: "query",
                    required: false,
                    schema: { type: "string" }
                },
                {
                    name: "post_graduate",
                    in: "query",
                    required: false,
                    schema: { type: "string" }
                },
                {
                    name: "experience",
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
                    description: "Data fetched successfully.",
                },
                401: { description: "Unauthorized" },
            },
        },
    },
    "/api/admin/professional/{accountId}": {
        get: {
            tags: ["Admin Dashboard API"],
            summary: "Get Professional by accountId",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "accountId",
                    in: "path",
                    required: true,
                    schema: { type: "string" }
                }
            ],
            responses: {
                200: {
                    description: "Data fetched successfully.",
                },
                401: { description: "Unauthorized" },
                404: { description: "Professional not found" },
            },
        },
        delete: {
            tags: ["Admin Dashboard API"],
            summary: "Delete professional by accountId",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "accountId",
                    in: "path",
                    required: true,
                    schema: { type: "string" }
                }
            ],
            responses: {
                200: {
                    description: "Professional account deleted successfully.",
                },
                401: { description: "Unauthorized" },
                404: { description: "Professional not found" },
            },
        },
    },
    "/api/admin/mentors": {
        get: {
            tags: ["Admin Dashboard API"],
            summary: "Get all Mentors for admin",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "searchTerm",
                    in: "query",
                    required: false,
                    schema: { type: "string" },
                    description: "Search mentors by firstName or lastName",
                },
                {
                    name: "status",
                    in: "query",
                    required: false,
                    schema: { type: "string" },
                    description: "Filter mentors by status",
                },
                {
                    name: "page",
                    in: "query",
                    required: false,
                    schema: { type: "integer", default: 1 },
                },
                {
                    name: "limit",
                    in: "query",
                    required: false,
                    schema: { type: "integer", default: 10 },
                },
            ],
            responses: {
                200: {
                    description: "Mentors fetched successfully.",
                },
                401: { description: "Unauthorized" },
            },
        },
    },

    "/api/admin/mentor/{accountId}": {
        get: {
            tags: ["Admin Dashboard API"],
            summary: "Get Mentor by accountId",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "accountId",
                    in: "path",
                    required: true,
                    schema: { type: "string" },
                    description: "The ID of the mentor account",
                },
            ],
            responses: {
                200: {
                    description: "Mentor fetched successfully.",
                },
                401: { description: "Unauthorized" },
                404: { description: "Mentor not found" },
            },
        },
        delete: {
            tags: ["Admin Dashboard API"],
            summary: "Delete Mentor by accountId",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "accountId",
                    in: "path",
                    required: true,
                    schema: { type: "string" },
                    description: "The ID of the mentor account",
                },
            ],
            responses: {
                200: {
                    description: "Mentor account deleted successfully.",
                },
                401: { description: "Unauthorized" },
                404: { description: "Mentor not found" },
            },
        },
    },


    // for admin config

    "/api/admin/admins": {
        get: {
            tags: ["Admin Config API"],
            summary: "Get all admins",
            security: [{ bearerAuth: [] }],
            responses: {
                200: {
                    description: "Admins fetched successfully.",
                },
                401: { description: "Unauthorized" },
            },
        },
    },
    "/api/admin/admins/create-new-admin": {
        post: {
            tags: ["Admin Config API"],
            summary: "Create new admin",
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                email: { type: "string" },
                                password: { type: "string" },
                                firstName: { type: "string" },
                                lastName: { type: "string" },
                            },
                            required: ["email", "password", "firstName", "lastName"],
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: "Admin created successfully.",
                },
                401: { description: "Unauthorized" },
            },
        },
    },
    "/api/admin/admins/{adminId}": {
        delete: {
            tags: ["Admin Config API"],
            summary: "Delete admin",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "adminId",
                    in: "path",
                    required: true,
                    schema: { type: "string" },
                    description: "The ID of the admin account",
                },
            ],
            responses: {
                200: {
                    description: "Admin deleted successfully.",
                },
                401: { description: "Unauthorized" },
                404: { description: "Admin not found" },
            },
        },
    },

};
