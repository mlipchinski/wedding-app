import express from 'express';

export class ErrorMiddleware {
    constructor() {
    }

    public static handleNotFound(req: express.Request, res: express.Response, _next: express.NextFunction) {
        res.status(404).json({ error: "Not Found" });
    }

    public static handleGeneralError(err: any, res: express.Response, _next: express.NextFunction) {
        console.error(err.stack);
        res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
    }
}