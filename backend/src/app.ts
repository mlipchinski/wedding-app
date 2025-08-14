import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import { ErrorMiddleware } from "./middleware/error";
import rateLimit from "express-rate-limit";
import compression from "compression";

export class App {
    
    private app: express.Application;

    private readonly PORT: number = Number(process.env.PORT) || 4000;;
    private readonly CLIENT_ORIGIN: string = process.env.CLIENT_ORIGIN || "http://localhost:3000";
    private readonly RATE_LIMIT_WINDOW_MS: number =process.env.RATE_LIMIT_WINDOW_MS ? Number(process.env.RATE_LIMIT_WINDOW_MS) : 15 * 60 * 1000;
    private readonly RATE_LIMIT_MAX: number = process.env.RATE_LIMIT_MAX ? Number(process.env.RATE_LIMIT_MAX) : 100;

    constructor() {
        dotenv.config();

        this.initApp();
        this.initMiddleware();
        this.initRoutes();
    }
    private initRoutes() {
        // Routes
        this.app.get("/health", (_req, res) => res.json({ status: "ok" }));
    }

    private initMiddleware(): void {
        // Logging
        this.app.use(morgan("dev"));

        // Security
        this.app.use(helmet());

        // CORS
        this.app.use(cors({
            origin: process.env.CLIENT_ORIGIN || this.CLIENT_ORIGIN,
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }));

        // Body parsing
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));

        // Rate limitt
        this.app.use(rateLimit({
            windowMs: this.RATE_LIMIT_WINDOW_MS,
            max: this.RATE_LIMIT_MAX,
        }));

        this.app.use(compression())

        this.initErrorHandling();
    }

    private initErrorHandling(): void {
        this.app.use(ErrorMiddleware.handleGeneralError);
        this.app.use(ErrorMiddleware.handleNotFound);    
    }

    private initApp(): void {
        this.app = express();

        // Serve Frontend
        const clientDist = path.resolve(__dirname, "../../frontend/dist");
        this.app.use(express.static(clientDist));
    }

    public startServer(): void {
        this.app.listen(this.PORT, () => {
            console.log(`Server listening at PORT: ${this.PORT}`);
        });
    }
}