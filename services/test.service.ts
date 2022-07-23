import {db} from "../utils/mysql.connector";
import {QueryError, RowDataPacket} from "mysql2";
import {TestProps} from "../models/Test.model";

export class TestService {

    private static instance?: TestService;

    public static getInstance(): TestService {
        if (TestService.instance === undefined) {
            TestService.instance = new TestService();
        }
        return TestService.instance;
    }

    private constructor() {
    }

    public async getAllTest() {
        let sqlQuery: string = "SELECT * FROM Test";
        return new Promise<RowDataPacket[]>((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            });
        });
    }

    async addTest(param: TestProps) {
        console.log(param);
        let sqlQuery: string = `INSERT INTO Test (name, lastname) VALUES ('${param.name}', '${param.lastname}')`;
        return new Promise<RowDataPacket[]>((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if (error) {
                    console.log(error);
                    return reject(error);
                }
                return resolve(results);
            });
        });
    }
}