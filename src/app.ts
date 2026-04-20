import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Request, Response } from 'express';
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import globalErrorHandler from './app/middlewares/global_error_handler';
import notFound from './app/middlewares/not_found_api';
import appRouter from './routes';
import { swaggerOptions } from './swaggerOptions';
const app = express()


const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// middleware
app.use(cors({
    origin: [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://testing.zyura-e.com",
        "https://ai-student-protal.netlify.app",
        "https://zyura-e.com",
        "https://www.zyura-e.com"
    ],
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    credentials: true
}))
app.use(express.json({ limit: "100mb" }))
app.use(express.raw())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.use("/api", appRouter)


app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        status: "success",
        message: "AI Student portal server is running successfully! health 50%",
        data: null,
    });
});


// global error handler
app.use(globalErrorHandler);
app.use(notFound);

// export app
export default app;