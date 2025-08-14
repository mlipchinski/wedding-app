import express from "express";
import morgan from "morgan";
import path from "path";
import compression from "compression";
import { errorHandler, notFound } from "./middleware/error";
import { validate } from "./middleware/validate";
import { security } from "./middleware/security";
import { routes } from "./routes";
import cookieParser from "cookie-parser";

export const initApp = (): express.Application => {
    const app: express.Application = express();

    const clientDist = path.resolve(__dirname, "../../frontend/dist");
    app.use(express.static(clientDist));

    app.use(morgan("dev"));
    app.use(...security);

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(compression())
    app.use(cookieParser());

    app.use('/api', routes);

    app.use(errorHandler);
    app.use(notFound);

    return app;
};

