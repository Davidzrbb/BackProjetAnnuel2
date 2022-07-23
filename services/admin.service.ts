import {QueryError, RowDataPacket} from "mysql2";
import {db} from "../utils/mysql.connector";

export class AdminService{

    private static instance?: AdminService;

    public static getInstance(): AdminService {
        if (AdminService.instance === undefined) {
            AdminService.instance = new AdminService();
        }
        return AdminService.instance;
    }

    public async ban(userId : number) {
        let sqlQuery = `UPDATE users SET banned = 1 WHERE id LIKE ${userId}`
        return new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error)
                }
                return resolve(results);
            })
        }))
    }
    public async unBan(userId : number) {
        let sqlQuery = `UPDATE users SET banned = 0 WHERE id LIKE ${userId}`
        return new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error)
                }
                return resolve(results);
            })
        }))
    }

}