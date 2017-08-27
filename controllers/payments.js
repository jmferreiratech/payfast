import {PaymentDAO} from "../persistency/PaymentDAO";
import {ConnectionFactory} from "../persistency/ConnectionFactory";
import CardsService from "../services/CardsService";

const PaymentTypes = {
    CREATED: "CREATED",
    CONFIRMED: "CONFIRMED",
    CANCELED: "CANCELED",
};

export default app => {
    app.route("/payments").get((req, res) => res.send('ok'));

    app.route("/payments/payment").post((req, res) => {
        validatePayment(req)
            .then(() => {
                console.log("Processing payment...");
                const {payment} = req.body;
                payment.status = PaymentTypes.CREATED;
                payment.date = new Date();

                new PaymentDAO(ConnectionFactory.createConnection())
                    .save(payment)
                    .then(result => {
                        payment.id = result.insertId;
                        return {payment};
                    })
                    .then(response => {
                        if (response.payment.payment_method === "card") {
                            const {card} = req.body;
                            return new CardsService().authorize(card)
                                .then(result => {
                                    response.card = result;
                                    return response;
                                });
                        }
                        return response;
                    })
                    .then(response => {
                        response.links =  [
                            {
                                href: `/payments/payment/${payment.id}`,
                                rel: "confirm",
                                method: "PUT",
                            },
                            {
                                href: `/payments/payment/${payment.id}`,
                                rel: "cancel",
                                method: "DELETE",
                            },
                        ];
                        res.location(`/payments/payment/${response.payment.id}`);
                        res.status(201).json(response);
                    })
                    .catch(error => {
                        console.log(`Error while creating payment: ${error}`);
                        res.status(500).send(error);
                    });
            })
            .catch(errors => {
                console.log("Validation errors found");
                res.status(400).send(errors);
            });
    });

    app.route("/payments/payment/:id").put((req, res) => {
        const id = req.params.id;
        const payment = {
            id,
            status: PaymentTypes.CONFIRMED,
        };

        new PaymentDAO(ConnectionFactory.createConnection())
            .update(payment)
            .then(() => res.status(200).send(payment))
            .catch(error => {
                console.log(`Error while persisting in the database: ${error}`);
                res.status(500).send(error);
            });
    });

    app.route("/payments/payment/:id").delete((req, res) => {
        const id = req.params.id;
        const payment = {
            id,
            status: PaymentTypes.CANCELED,
        };

        new PaymentDAO(ConnectionFactory.createConnection())
            .update(payment)
            .then(() => res.status(203).send(payment))
            .catch(error => {
                console.log(`Error while persisting in the database: ${error}`);
                res.status(500).send(error);
            });
    });
};

function validatePayment(req) {
    req.assert("payment.payment_method", "Payment method is mandatory.").notEmpty();
    req.assert("payment.value", "Value is mandatory and has to be decimal.").notEmpty().isFloat();
    req.assert("payment.currency", "Currency has to have 3 digits").notEmpty().len(3, 3);
    return req.getValidationResult()
        .then(errors => {
            return errors.isEmpty() ? Promise.resolve() : Promise.reject(errors.array());
        });
}
