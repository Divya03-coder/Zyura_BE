export const authDocs = {
    "/api/auth/register": {
        post: {
            tags: ["Auth"],
            summary: "Register a new user",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["email", "password"],
                            properties: {
                                email: { type: "string", example: "user@example.com" },
                                password: { type: "string", example: "secret123" }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: "User registered successfully" }
            }
        }
    },
    "/api/auth/login": {
        post: {
            tags: ["Auth"],
            summary: "Login a user",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["email", "password"],
                            properties: {
                                email: { type: "string", example: "softvence.abumahid@gmail.com" },
                                password: { type: "string", example: "123456" }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: "User logged in successfully" }
            }
        }
    },
    "/api/auth/verified-account": {
        post: {
            tags: ["Auth"],
            summary: "Verify Account with OTP",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["email"],
                            properties: {
                                email: { type: "string", example: "user@example.com" },
                                otp: { type: "string", example: "123456" },
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: "OTP verified successfully" }
            }
        }
    },
    "/api/auth/new-verification-otp": {
        post: {
            tags: ["Auth"],
            summary: "Request for new OTP",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["email"],
                            properties: {
                                email: { type: "string", example: "user@example.com" },
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: "OTP resend successfully" }
            }
        }
    },
    "/api/auth/forgot-password": {
        post: {
            tags: ["Auth"],
            summary: "Request password reset",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["email"],
                            properties: {
                                email: { type: "string", example: "user@example.com" }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: "Password reset email sent" }
            }
        }
    },
    "/api/auth/reset-password": {
        post: {
            tags: ["Auth"],
            summary: "Reset password using OTP",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["email", "otp", "newPassword"],
                            properties: {
                                email: { type: "string", example: "user@example.com" },
                                otp: { type: "string", example: "123456" },
                                newPassword: { type: "string", example: "newPassword123" }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: "Password reset successfully" }
            }
        }
    },
    "/api/auth/change-password": {
        post: {
            tags: ["Auth"],
            summary: "Change password",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["newPassword", "oldPassword"],
                            properties: {
                                newPassword: { type: "string", example: "123456" },
                                oldPassword: { type: "string", example: "000000" }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: "Password change successfully" }
            }
        }
    },
    "/api/auth/change-status": {
        post: {
            tags: ["Auth"],
            summary: "Change account status (Admin)- [ACTIVE, INACTIVE, SUSPENDED]",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["email", "status"],
                            properties: {
                                email: { type: "string", example: "student@gmail.com" },
                                status: { type: "string", example: "INACTIVE" }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: "Account status change successfully" }
            }
        }
    },
    "/api/auth/sign-in-with-google": {
        post: {
            tags: ["Auth"],
            summary: "Sign in with Google",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["email", "name"],
                            properties: {
                                email: { type: "string", example: "student@gmail.com" },
                                name: { type: "string", example: "John Doe" },
                                photo: { type: "string", example: "https://example.com/photo.jpg" }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: "Google sign-in successful" }
            }
        }
    },
    "/api/auth/me": {
        get: {
            tags: ["Auth"],
            summary: "Get logged-in user's profile",
            security: [{ bearerAuth: [] }],
            responses: {
                200: { description: "Profile data" }
            }
        }
    },
    "/api/auth/update-initial-profile": {
        patch: {
            tags: ["Auth"],
            summary: "Update initial profile with file upload",
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    "multipart/form-data": {
                        schema: {
                            type: "object",
                            properties: {
                                image: { type: "string", format: "binary" },
                                data: {
                                    type: "object",
                                    description: "JSON string of initial profile data",
                                    example: JSON.stringify({
                                        role: "STUDENT",
                                        student: {
                                            firstName: "Alice",
                                            lastName: "Johnson",
                                            university: "Harvard University",
                                            country: "USA",
                                            year_of_study: "3",
                                            studentType: "MEDICAL_STUDENT",
                                            preparingFor: [{
                                                examName: "Masters in Computer Science",
                                                description: "Master of Science in Computer Science"
                                            }]
                                        }
                                    })
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: "Profile updated successfully" }
            }
        }
    },
    "/api/auth/update-profiles": {
        put: {
            tags: ["Auth"],
            summary: "Update initial profile with file upload",
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    "multipart/form-data": {
                        schema: {
                            type: "object",
                            properties: {
                                image: { type: "string", format: "binary" },
                                data: {
                                    type: "string",
                                    description: " You need to pass valid data type for each product like-> Student , Mentor, Professional based on the role",
                                    example: JSON.stringify({
                                        // student
                                    })
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: "Profile updated successfully" }
            }
        }
    }
};
