import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { ErrorMiddleware } from "./middleware/error";
import rateLimit from "express-rate-limit";
import compression from "compression";
import { env } from "./config/env";

export class App {

    private app: express.Application;
    private readonly ENV = env;

    constructor() {
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
            origin: this.ENV.clientOrigin,
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }));

        // Body parsing
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));

        // Rate limitt
        this.app.use(rateLimit({
            windowMs: this.ENV.rateLimitWindowMs,
            max: this.ENV.rateLimitMax,
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
        this.app.listen(this.ENV.port, () => {
            console.log(`Server listening at PORT: ${this.ENV.port}`);
        });
    }
}