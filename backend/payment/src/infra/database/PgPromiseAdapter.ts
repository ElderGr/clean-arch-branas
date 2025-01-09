import pgp from 'pg-promise'
import DatabaseConnection from './DatabaseConnection';

export default class PgPromiseAdapter implements DatabaseConnection {
    connection: any;

    constructor() {
        this.connection = pgp()("postgres://postgres:postgres123@localhost:5432/postgres");
    }

    async query(statement: string, params: any): Promise<any> {
        return this.connection.query(statement, params);
    }
    async close(): Promise<void> {        
        await this.connection.$pool.end();
    }
}