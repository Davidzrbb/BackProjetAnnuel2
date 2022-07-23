import {QueryError, RowDataPacket} from "mysql2";
import {db} from "../utils";

export class StatsService {
    private static instance?: StatsService;

    public static getInstance(): StatsService {
        if (StatsService.instance === undefined) {
            StatsService.instance = new StatsService();
        }
        return StatsService.instance;
    }

    private constructor() {
    }

    async getUserCount() {
        let sqlQuery: string = "SELECT COUNT(*) FROM users";
        return new Promise<RowDataPacket[]>((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            });
        });
    }

    async getCountAllContrat() {
        let sqlQuery: string = "SELECT COUNT(*) FROM contracts";
        return new Promise<RowDataPacket[]>((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            });
        });
    }
}