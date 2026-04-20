
export const reportSwaggerDocs = {
    "/api/report/all-admin": {
        get: {
            tags: ["Reports"],
            summary: "This route is for getting all reports for admin",
            description: "",
            security: [{ bearerAuth: [] }],
            parameters: [
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
                },
                {
                    name: "searchTerm",
                    in: "query",
                    required: false,
                    schema: { type: "string", }
                },
                {
                    name: "status",
                    in: "query",
                    required: false,
                    schema: { type: "string", }
                }
            ],
            responses: {
                201: { description: "Report fetched successfully" },
                400: { description: "Validation error" }
            }
        }
    },
    "/api/report/all-reporter": {
        get: {
            tags: ["Reports"],
            summary: "This route is for getting all reports for student, mentor and professional",
            description: "",
            security: [{ bearerAuth: [] }],
            responses: {
                201: { description: "Report fetched successfully" },
                400: { description: "Validation error" }
            }
        }
    },
    "/api/report/update-status/{reportId}": {
        patch: {
            tags: ["Reports"],
            summary: "This route accessible for admin",
            description: "Pass the valid status and id --> IN_REVIEW | RESOLVED | REJECTED",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "reportId",
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
                                status: { type: "string", required: true, enum: ["IN_REVIEW", "RESOLVED", "REJECTED"] },
                                note: { type: "string", example: "Hey, You are right.", required: false }
                            }
                        }
                    }
                }
            },
            responses: {
                201: { description: "Report status update successfully" },
                400: { description: "Validation error" }
            }
        }
    },
    "/api/report/delete/{reportId}": {
        delete: {
            tags: ["Reports"],
            summary: "This route is for deleting a report- Only for admin",
            description: "Pass the valid report ID",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "reportId",
                    in: "path",
                    required: true,
                    schema: { type: "string" }
                }
            ],
            responses: {
                200: { description: "Report deleted successfully" },
                400: { description: "Validation error" },
                401: { description: "Unauthorized" },
                404: { description: "Report not found" }
            }
        }
    }
}


