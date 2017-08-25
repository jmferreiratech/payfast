import {PaymentDAO} from "../persistency/PaymentDAO";
import {ConnectionFactory} from "../persistency/ConnectionFactory";

export default app => {
    app.route("/payments").get((req, res) => res.send('ok'));

    app.route("/payments/payment").post((req, res) => {
        validatePayment(req)
            .then(() => {
                console.log("Processing payment...");
                const payment = req.body;
                payment.status = 'CREATED';
                payment.date = new Date();

                new PaymentDAO(ConnectionFactory.createConnection())
                    .save(payment)
                    .then(result => {
                        console.log('Payment created: ' + result);
                        res.location(`/payments/payment/${result.insertId}`);
                        payment.id = result.insertId;
                        res.status(201).json(payment);
                    })
                    .catch(error => {
                        console.log(`Error while persisting in the database: ${error}`);
                        res.status(500).send(error);
                    });
            })
            .catch(errors => {
                console.log("Validation errors found");
                res.status(400).send(errors);
            });
    });
};

function validatePayment(req) {
    req.assert("payment_method", "Payment method is mandatory.").notEmpty();
    req.assert("value", "Value is mandatory and has to be decimal.").notEmpty().isFloat();
    req.assert("currency", "Currency has to have 3 digits").notEmpty().len(3, 3);
    return req.getValidationResult()
        .then(errors => {
            return errors.isEmpty() ? Promise.resolve() : Promise.reject(errors.array());
        });
}
