
export const examSwaggerDocs = {
    // for student
    "/api/exam/student/upload-exam-with-bulk-mcq": {
        post: {
            tags: ["Exam Management Student -(Admin)"],
            summary: "Upload exam with bulk mcq for student  -- (total time must be in minutes on number)",
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    "multipart/form-data": {
                        schema: {
                            type: "object",
                            properties: {
                                data: {
                                    type: "object",
                                    example: JSON.stringify(
                                        {
                                            profileType: "Nursing Student",
                                            examName: "Anatomy Essentials MCQs",
                                            subject: "Anatomy",
                                            totalTime: 60
                                        }
                                    )
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
                201: { description: "Exam uploaded successfully" },
                400: { description: "Invalid data format or missing fields" },
                401: { description: "Unauthorized" },
            },
        },
    },
    "/api/exam/student/upload-exam-with-manual-mcq": {
        post: {
            tags: ["Exam Management Student -(Admin)"],
            summary: "Upload exam with manual mcq for student",
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            example: {
                                profileType: "Nursing Student",
                                examName: "Anatomy Essentials MCQs",
                                subject: "Anatomy",
                                totalTime: 60,
                                mcqs: [
                                    {
                                        question: "Which part of the brain is responsible for coordination and balance?",
                                        imageDescription: "https://example.com/images/brain-diagram.png",
                                        options: [
                                            {
                                                option: "A",
                                                optionText: "Cerebrum",
                                                explanation: "Responsible for higher brain functions like thought and action."
                                            },
                                            {
                                                option: "B",
                                                optionText: "Cerebellum",
                                                explanation: "Maintains balance, posture, and coordination of voluntary movements."
                                            },
                                            {
                                                option: "C",
                                                optionText: "Medulla Oblongata",
                                                explanation: "Controls automatic functions such as breathing and heart rate."
                                            },
                                            {
                                                option: "D",
                                                optionText: "Hypothalamus",
                                                explanation: "Regulates body temperature, hunger, and hormonal balance."
                                            }
                                        ],
                                        correctOption: "B"
                                    }
                                ]
                            },
                            required: ["data"],
                        },
                    },
                },
            },
            responses: {
                201: { description: "Exam uploaded successfully" },
                400: { description: "Invalid data format or missing fields" },
                401: { description: "Unauthorized" },
            },
        },
    },
    "/api/exam/student/get-all-exam": {
        get: {
            tags: ["Exam Management Student -(Admin)"],
            summary: "Get all exam for student",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "searchTerm",
                    in: "query",
                    type: "string",
                },
                {
                    name: "subject",
                    in: "query",
                    type: "string",
                },
                {
                    name: "profileType",
                    in: "query",
                    type: "string",
                },
                {
                    name: "page",
                    in: "query",
                    type: "number",
                    default: 1,
                },
                {
                    name: "limit",
                    in: "query",
                    type: "number",
                    default: 10,
                },
            ],
            responses: {
                200: { description: "Exam fetched successfully" },
            },
        },
    },
    "/api/exam/student/get-single-exam/{id}": {
        get: {
            tags: ["Exam Management Student -(Admin)"],
            summary: "Get single exam for student",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    type: "string",
                    description: "Id of the exam",
                    required: true,
                },
                {
                    name: "page",
                    in: "query",
                    type: "number",
                    default: 1,
                },
                {
                    name: "limit",
                    in: "query",
                    type: "number",
                    default: 10,
                }

            ],
            responses: {
                200: { description: "Exam fetched successfully" },
            },
        },
    },
    "/api/exam/student/update-exam/{id}": {
        put: {
            tags: ["Exam Management Student -(Admin)"],
            summary: "Update exam for student",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    type: "string",
                    description: "Id of the exam",
                    required: true,
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            example: {
                                profileType: "Nursing Student",
                                examName: "Anatomy Essentials MCQs",
                                subject: "Anatomy",
                                totalTime: 60,
                            },
                            required: ["data"],
                        },
                    },
                },
            },
            responses: {
                200: { description: "Exam updated successfully" },
            },
        },
    },
    "/api/exam/student/update-mcq/{examId}/{mcqId}": {
        put: {
            tags: ["Exam Management Student -(Admin)"],
            summary: "Update exam for student",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "examId",
                    in: "path",
                    type: "string",
                    description: "Id of the exam",
                    required: true,
                },
                {
                    name: "mcqId",
                    in: "path",
                    type: "string",
                    description: "Id of the mcq",
                    required: true,
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            example: {
                                question: "Which cranial nerve controls facial expressions?",
                                optionA: "Optic nerve",
                                optionB: "Facial nerve",
                                optionC: "Trigeminal nerve",
                                optionD: "Vagus nerve",
                                optionE: "Vagus nerve",
                                optionF: "Vagus nerve",
                                correctOption: "B",
                                explanationB: "The facial nerve controls muscles of facial expression.",
                            },
                        },
                    },
                },
            },
            responses: {
                200: { description: "Exam updated successfully" },
            },
        },
    },
    "/api/exam/student/delete-exam/{id}": {
        delete: {
            tags: ["Exam Management Student -(Admin)"],
            summary: "Delete exam for student",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    type: "string",
                    description: "Id of the exam",
                    required: true,
                }
            ],
            responses: {
                200: { description: "Exam deleted successfully" },
            },
        },
    },
    "/api/exam/student/add-more-mcq/{id}": {
        put: {
            tags: ["Exam Management Student -(Admin)"],
            summary: "Add more mcq for student",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    type: "string",
                    description: "Id of the exam",
                    required: true,
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            example: {
                                mcqs: [
                                    {
                                        question: "Which part of the brain is responsible for coordination and balance?",
                                        imageDescription: "https://example.com/images/brain-diagram.png",
                                        options: [
                                            {
                                                option: "A",
                                                optionText: "Cerebrum",
                                                explanation: "Responsible for higher brain functions like thought and action."
                                            },
                                            {
                                                option: "B",
                                                optionText: "Cerebellum",
                                                explanation: "Maintains balance, posture, and coordination of voluntary movements."
                                            },
                                            {
                                                option: "C",
                                                optionText: "Medulla Oblongata",
                                                explanation: "Controls automatic functions such as breathing and heart rate."
                                            },
                                            {
                                                option: "D",
                                                optionText: "Hypothalamus",
                                                explanation: "Regulates body temperature, hunger, and hormonal balance."
                                            }
                                        ],
                                        correctOption: "B"
                                    }
                                ]
                            },
                        },
                    },
                },
            },
            responses: {
                200: { description: "MCQ added successfully" },
            },
        },
    },
    "/api/exam/student/delete-specific-mcq/{examId}/{mcqId}": {
        delete: {
            tags: ["Exam Management Student -(Admin)"],
            summary: "Delete specific mcq for student",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "examId",
                    in: "path",
                    type: "string",
                    description: "Id of the exam",
                    required: true,
                },
                {
                    name: "mcqId",
                    in: "path",
                    type: "string",
                    description: "Id of the mcq",
                    required: true,
                }
            ],
            responses: {
                200: { description: "Specific mcq deleted successfully" },
            },
        },
    },

    // for professional
    "/api/exam/professional/upload-exam-with-bulk-mcq": {
        post: {
            tags: ["Exam Management Professional -(Admin)"],
            summary: "Upload exam with bulk mcq for professional  -- (total time must be in minutes on number)",
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    "multipart/form-data": {
                        schema: {
                            type: "object",
                            properties: {
                                data: {
                                    type: "object",
                                    example: JSON.stringify(
                                        {
                                            professionName: "Dentist",
                                            examName: "Anatomy Essentials MCQs",
                                            totalTime: 60
                                        }
                                    )
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
                201: { description: "Exam uploaded successfully" },
                400: { description: "Invalid data format or missing fields" },
                401: { description: "Unauthorized" },
            },
        },
    },
    "/api/exam/professional/upload-exam-with-manual-mcq": {
        post: {
            tags: ["Exam Management Professional -(Admin)"],
            summary: "Upload exam with manual mcq for professional",
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            example: {
                                professionName: "Dentist",
                                examName: "Anatomy Essentials MCQs",
                                totalTime: 60,
                                mcqs: [
                                    {
                                        question: "Which part of the brain is responsible for coordination and balance?",
                                        imageDescription: "https://example.com/images/brain-diagram.png",
                                        options: [
                                            {
                                                option: "A",
                                                optionText: "Cerebrum",
                                                explanation: "Responsible for higher brain functions like thought and action."
                                            },
                                            {
                                                option: "B",
                                                optionText: "Cerebellum",
                                                explanation: "Maintains balance, posture, and coordination of voluntary movements."
                                            },
                                            {
                                                option: "C",
                                                optionText: "Medulla Oblongata",
                                                explanation: "Controls automatic functions such as breathing and heart rate."
                                            },
                                            {
                                                option: "D",
                                                optionText: "Hypothalamus",
                                                explanation: "Regulates body temperature, hunger, and hormonal balance."
                                            }
                                        ],
                                        correctOption: "B"
                                    }
                                ]
                            },
                            required: ["data"],
                        },
                    },
                },
            },
            responses: {
                201: { description: "Exam uploaded successfully" },
                400: { description: "Invalid data format or missing fields" },
                401: { description: "Unauthorized" },
            },
        },
    },
    "/api/exam/professional/get-all-exam": {
        get: {
            tags: ["Exam Management Professional -(Admin)"],
            summary: "Get all exam for professional",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "searchTerm",
                    in: "query",
                    type: "string",
                },
                {
                    name: "subject",
                    in: "query",
                    type: "string",
                },
                {
                    name: "professionName",
                    in: "query",
                    type: "string",
                },
                {
                    name: "page",
                    in: "query",
                    type: "number",
                    default: 1,
                },
                {
                    name: "limit",
                    in: "query",
                    type: "number",
                    default: 10,
                },
            ],
            responses: {
                200: { description: "Exam fetched successfully" },
            },
        },
    },
    "/api/exam/professional/get-single-exam/{id}": {
        get: {
            tags: ["Exam Management Professional -(Admin)"],
            summary: "Get single exam for professional",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    type: "string",
                    description: "Id of the exam",
                    required: true,
                },
                {
                    name: "page",
                    in: "query",
                    type: "number",
                    default: 1,
                },
                {
                    name: "limit",
                    in: "query",
                    type: "number",
                    default: 10,
                }

            ],
            responses: {
                200: { description: "Exam fetched successfully" },
            },
        },
    },
    "/api/exam/professional/update-exam/{id}": {
        put: {
            tags: ["Exam Management Professional -(Admin)"],
            summary: "Update exam for professional",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    type: "string",
                    description: "Id of the exam",
                    required: true,
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            example: {
                                professionName: "Dentist",
                                examName: "Anatomy Essentials MCQs",
                                subject: "Anatomy",
                                totalTime: 60,
                            },
                            required: ["data"],
                        },
                    },
                },
            },
            responses: {
                200: { description: "Exam updated successfully" },
            },
        },
    },
    "/api/exam/professional/update-mcq/{examId}/{mcqId}": {
        put: {
            tags: ["Exam Management Professional -(Admin)"],
            summary: "Update exam for professional",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "examId",
                    in: "path",
                    type: "string",
                    description: "Id of the exam",
                    required: true,
                },
                {
                    name: "mcqId",
                    in: "path",
                    type: "string",
                    description: "Id of the mcq",
                    required: true,
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            example: {
                                question: "Which cranial nerve controls facial expressions?",
                                optionA: "Optic nerve",
                                optionB: "Facial nerve",
                                optionC: "Trigeminal nerve",
                                optionD: "Vagus nerve",
                                optionE: "Vagus nerve",
                                optionF: "Vagus nerve",
                                correctOption: "B",
                                explanationB: "The facial nerve controls muscles of facial expression.",
                            },
                        },
                    },
                },
            },
            responses: {
                200: { description: "Exam updated successfully" },
            },
        },
    },
    "/api/exam/professional/delete-exam/{id}": {
        delete: {
            tags: ["Exam Management Professional -(Admin)"],
            summary: "Delete exam for professional",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    type: "string",
                    description: "Id of the exam",
                    required: true,
                }
            ],
            responses: {
                200: { description: "Exam deleted successfully" },
            },
        },
    },
     "/api/exam/professional/add-more-mcq/{id}": {
        put: {
            tags: ["Exam Management Professional -(Admin)"],
            summary: "Add more mcq for professional",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    type: "string",
                    description: "Id of the exam",
                    required: true,
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            example: {
                                mcqs: [
                                    {
                                        question: "Which part of the brain is responsible for coordination and balance?",
                                        imageDescription: "https://example.com/images/brain-diagram.png",
                                        options: [
                                            {
                                                option: "A",
                                                optionText: "Cerebrum",
                                                explanation: "Responsible for higher brain functions like thought and action."
                                            },
                                            {
                                                option: "B",
                                                optionText: "Cerebellum",
                                                explanation: "Maintains balance, posture, and coordination of voluntary movements."
                                            },
                                            {
                                                option: "C",
                                                optionText: "Medulla Oblongata",
                                                explanation: "Controls automatic functions such as breathing and heart rate."
                                            },
                                            {
                                                option: "D",
                                                optionText: "Hypothalamus",
                                                explanation: "Regulates body temperature, hunger, and hormonal balance."
                                            }
                                        ],
                                        correctOption: "B"
                                    }
                                ]
                            },
                        },
                    },
                },
            },
            responses: {
                200: { description: "MCQ added successfully" },
            },
        },
    },
    "/api/exam/professional/delete-specific-mcq/{examId}/{mcqId}": {
        delete: {
            tags: ["Exam Management Professional -(Admin)"],
            summary: "Delete specific mcq for professional",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "examId",
                    in: "path",
                    type: "string",
                    description: "Id of the exam",
                    required: true,
                },
                {
                    name: "mcqId",
                    in: "path",
                    type: "string",
                    description: "Id of the mcq",
                    required: true,
                }
            ],
            responses: {
                200: { description: "Specific mcq deleted successfully" },
            },
        },
    },
}


