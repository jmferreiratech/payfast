const dbName = 'payments';

export class PaymentDAO {

    constructor(connection) {
        this._connection = connection;
    }

    save(payment) {
        return doQuery(
            this._connection,
            `INSERT INTO ${dbName} SET ?`,
            payment
        );
    }

    update(payment) {
        return doQuery(
            this._connection,
            `UPDATE ${dbName} SET status = ? WHERE id = ?`,
            [payment.status, payment.id]
        );
    }

    list() {
        return doQuery(
            this._connection,
            `SELECT * FROM ${dbName}`
        );
    }

    findById(id) {
        return doQuery(
            this._connection,
            `SELECT * FROM ${dbName} WHERE id = ?`,
            [id]
        );
    }
}

function doQuery(connection, query, args) {
    return new Promise((resolve, reject) => {
        connection.query(query, args, (exception, result) => {
            if (exception) {
                reject(exception);
            } else {
                resolve(result);
            }
        });
    });
}
