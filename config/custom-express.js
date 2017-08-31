import express from 'express';
import bodyParser from 'body-parser';
import consign from 'consign';
import expressValidator from 'express-validator';
import morgan from "morgan";
import Logger from "../services/LogService";

const app = express();

app.use(morgan("common", {
    stream: {
        write: msg => Logger.info(msg),
    },
}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(expressValidator());

consign()
    .include('controllers')
    .into(app);

export default app;
