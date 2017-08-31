import winston from "winston";
import fs from "fs";

if (!fs.existsSync("logs"))
    fs.mkdirSync("logs");

const Logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            level: "info",
            filename: "logs/payfast.log",
            maxsize: 1048576,
            maxFiles: 10,
        }),
    ],
});

export default Logger;
