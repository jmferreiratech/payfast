import PostService from "../services/PostService";
import * as HttpStatus from "http-status-codes";

export default app => {

    app.route("/post/delay").post((req, res) => {
        PostService.deliveryDelay(req.body)
            .then(result => {
                console.log('Delay calculated');
                res.json(result);
            })
            .catch(error => res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error));
    });
};
