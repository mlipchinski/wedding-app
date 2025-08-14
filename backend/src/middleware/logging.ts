import morgan from "morgan";
import winston from "winston";

export const logging = [
    morgan("dev"),
    () => { 
        winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({ filename: 'combined.log' })
            ]
        });
    },
];