const dbName = 'payments';

export class PaymentDAO {

    constructor(connection) {
        this._connection = connection;
    }

    save(payment) {
        return new Promise((resolve, reject) => {
            this._connection.query(`INSERT INTO ${dbName} SET ?`, payment, (exception, result) => {
                if (exception) {
                    reject(exception);
                } else {
                    resolve(result);
                }
            });
        });
    }

    update(payment) {
        return new Promise((resolve, reject) => {
            this._connection.query(
                `UPDATE ${dbName} SET status = ? WHERE id = ?`,
                [payment.status, payment.id],
                (exception, result) => {
                    if (exception) {
                        reject(exception);
                    } else {
                        resolve(result);
                    }
                });
        });
    }

    list() {
        return new Promise((resolve, reject) => {
            this._connection.query(`SELECT * FROM ${dbName}`, (exception, result) => {
                if (exception) {
                    reject(exception);
                } else {
                    resolve(result);
                }
            });
        });
    }

    findById(id) {
        return new Promise((resolve, reject) => {
            this._connection.query(`SELECT * FROM ${dbName} WHERE id = ?`, [id], (exception, result) => {
                if (exception) {
                    reject(exception);
                } else {
                    resolve(result);
                }
            });
        });
    }
}
