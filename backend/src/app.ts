import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

export class App {
    private app: express.Application;
    private PORT: number;

    constructor() {
        this.PORT = Number(process.env.PORT) || 4000;
        this.initApp();
    }

    private initApp(): void {
        this.app = express();

        // Logging
        this.app.use(morgan("dev"));

        // Security
        this.app.use(helmet());

        // CORS
        this.app.use(cors({
            origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }));

        // Body parsing
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));

        // Server Frontend
        const clientDist = path.resolve(__dirname, "../../frontend/dist");
        this.app.use(express.static(clientDist));

        // Routes
        this.app.get("/health", (_req, res) => res.json({ status: "ok" }));
        // Add more routes here, or import from separate route files

        // 404 handler
        this.app.use((_req, res, _next) => {
            res.status(404).json({ error: "Not Found" });
        });

        // Error handler
        this.app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
            console.error(err.stack);
            res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
        });
    }

    public startServer(): void {
        this.app.listen(this.PORT, () => {
            console.log(`Server listening at PORT: ${this.PORT}`);
        });
    }
}