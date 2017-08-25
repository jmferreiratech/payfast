import express from 'express';
import bodyParser from 'body-parser';
import consign from 'consign';
import expressValidator from 'express-validator';

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(expressValidator());

consign()
    .include('controllers')
    .into(app);

export default app;
