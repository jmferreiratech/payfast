import express from 'express';
import consign from 'consign';

const app = express();

consign({
    verbose: true,
})
    .include('controllers')
    .into(app);

export default app;
