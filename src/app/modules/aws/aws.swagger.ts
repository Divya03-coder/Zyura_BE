export const awsSwaggerDocs = {
  "/api/aws/upload-single-image": {
    post: {
      tags: ["AWS - Assets"],
      summary: "aws create",
      description: "Upload a single image for public url",
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                image: { type: "string", format: "binary" }
              },
              required: ["image"]
            }
          }
        }
      },
      responses: { 201: { description: "aws created successfully" }, 400: { description: "Validation error" } }
    }
  }
};