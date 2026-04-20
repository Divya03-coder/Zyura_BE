export const groupSwaggerDocs = {
  "/api/group/create-new-group": {
    post: {
      tags: ["Group"],
      summary: "Group Create - only for valid login user",
      description: "groupType must be public or private",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["groupName", "groupType"],
              properties: {
                groupName: { type: "string", example: "Cardiology - Practice" },
                groupType: { type: "string", example: "public" }
              }
            }
          }
        }
      },
      responses: {
        201: { description: "group created successfully" },
        400: { description: "Validation error" }
      }
    }
  },
  "/api/group/get-all-my-groups": {
    get: {
      tags: ["Group"],
      summary: "Get All My Groups - only for valid login user",
      description: "Get All My Groups - only for valid login user",
      parameters: [
        {
          name: "searchTerm",
          in: "query",
          required: false,
          description: "Search by group name"
        }
      ],
      responses: {
        200: { description: "groups fetched successfully" },
        400: { description: "Validation error" }
      }
    }
  },
  "/api/group/update-my-group/{groupId}": {
    put: {
      tags: ["Group"],
      summary: "Update My Group - only for valid login user",
      description: "Update My Group - only for valid login user",
      parameters: [
        {
          name: "groupId",
          in: "path",
          required: true,
          description: "Group Id"
        }
      ],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                file: { type: "string", format: "binary" },
                data: {
                  type: "object",
                  example: {
                    groupName: "Cardiology - Practice",
                    groupType: "public",
                    groupDescription: "Cardiology - Practice"
                  }
                }
              }
            }
          }
        }
      },
      responses: {
        200: { description: "group updated successfully" },
        400: { description: "Validation error" }
      }
    }
  },
  "/api/group/delete-my-group/{groupId}": {
    delete: {
      tags: ["Group"],
      summary: "Delete My Group - only for valid login user",
      description: "Delete My Group - only for valid login user",
      parameters: [
        {
          name: "groupId",
          in: "path",
          required: true,
          description: "Group Id"
        }
      ],
      responses: {
        200: { description: "group deleted successfully" },
        400: { description: "Validation error" }
      }
    }
  },
  "/api/group/add-members-into-group/{groupId}": {
    put: {
      tags: ["Group"],
      summary: "Add Members Into Group - only for valid login user",
      description: "Add Members Into Group - only for valid login user",
      parameters: [
        {
          name: "groupId",
          in: "path",
          required: true,
          description: "Group Id"
        }
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                members: { type: "array", items: { type: "string" } }
              }
            }
          }
        }
      },
      responses: {
        200: { description: "members added successfully" },
        400: { description: "Validation error" }
      }
    }
  },
  "/api/group/remove-member-from-group/{groupId}": {
    put: {
      tags: ["Group"],
      summary: "Remove Member From Group - only for valid login user",
      description: "Remove Member From Group - only for valid login user",
      parameters: [
        {
          name: "groupId",
          in: "path",
          required: true,
          description: "Group Id"
        }
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                memberId: { type: "string", }
              }
            }
          }
        }
      },
      responses: {
        200: { description: "member removed successfully" },
        400: { description: "Validation error" }
      }
    }
  },
  "/api/group/get-all-community-member": {
    get: {
      tags: ["Group"],
      summary: "Get All Community Member - only for valid login user",
      description: "Get All Community Member - only for valid login user",
      parameters: [
        {
          name: "searchTerm",
          in: "query",
          required: false,
          description: "Search by member name"
        },
        {
          name: "page",
          in: "query",
          required: false,
          description: "Page number",
          schema: { type: "integer", default: 1 }
        },
        {
          name: "limit",
          in: "query",
          required: false,
          description: "Limit number",
          schema: { type: "integer", default: 50 }
        }
      ],
      responses: {
        200: { description: "members fetched successfully" },
        400: { description: "Validation error" }
      }
    }
  }
};