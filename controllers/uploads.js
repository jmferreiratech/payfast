import fs from "fs";

export default app => {

    app.route("/upload/image").post((req, res) => {
        req.pipe(fs.createWriteStream(`files/${req.headers.filename}`))
            .on('finish', () => res.status(201).send('ok'));
    });
};
