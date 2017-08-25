import * as mysql from "mysql";

export class ConnectionFactory {

    constructor() {
        throw new Error('ConnectionFactory cannot be instantiated');
    }

    static createConnection() {
        return mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'payfast'
        });
    }
}
