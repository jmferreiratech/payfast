import fs from "fs";
import * as HttpStatus from "http-status-codes";

export default app => {

    app.route("/upload/image").post((req, res) => {
        req.pipe(fs.createWriteStream(`files/${req.headers.filename}`))
            .on('finish', () => res.status(HttpStatus.CREATED).send('ok'));
    });
};
