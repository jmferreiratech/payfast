import PostService from "../services/PostService";

export default app => {

    app.route("/post/delay").post((req, res) => {
        PostService.deliveryDelay(req.body)
            .then(result => {
                console.log('Delay calculated');
                res.json(result);
            })
            .catch(error => res.status(500).send(error));
    });
};
