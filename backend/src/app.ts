import express from "express";
import path from "path";
import compression from "compression";
import cookieParser from "cookie-parser";
import { error } from "./middleware/error";
import { security } from "./middleware/security";
import { routes } from "./routes";
import { logging } from "./middleware/logging";

export const initApp = (): express.Application => {
    const app: express.Application = express();

    const clientDist = path.resolve(__dirname, "../../frontend/dist");
    app.use(express.static(clientDist));

    app.use(...logging);
    app.use(...security);

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(compression());
    app.use(cookieParser());

    app.use('/api', routes);

    app.use(...error);

    return app;
};

