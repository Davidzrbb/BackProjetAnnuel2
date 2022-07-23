import {db} from "../utils";
import {QueryError, RowDataPacket} from "mysql2";
import {ActivityZoneProps} from "../models";

export class ActivtyZoneService {
    private static instance?: ActivtyZoneService;

    public static getInstance(): ActivtyZoneService {
        if (ActivtyZoneService.instance === undefined) {
            ActivtyZoneService.instance = new ActivtyZoneService();
        }
        return ActivtyZoneService.instance;
    }

    private constructor() {
    }

    insertPromise = (sql: string) => {
        return new Promise((resolve, reject) => {
            db.query(sql, (error, results) => {
                if (error) {
                    console.log(error);
                    return reject(error);
                }
                return resolve(results);
            });
        });
    };

    public async getAll() {
        let sqlQuery: string = "SELECT * FROM activityzone";
        return new Promise<RowDataPacket[]>((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            });
        });
    }

    public async getById(id: number) {
        let sqlQuery = `SELECT * FROM activityzone WHERE id LIKE ${id}`
        return new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error)
                }
                return resolve(results);
            })
        }))
    }

    public async getByPostId(id_post: number) {
        let sqlQuery = `SELECT * FROM activityzone WHERE id_post = ${id_post}`
        return new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error)
                }
                return resolve(results);
            })
        }))
    }

    public async deleteByPostId(id_post: number) {
        let sqlQuery = `DELETE FROM activityzone WHERE id_post = ${id_post}`
        return new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error)
                }
                return resolve(results);
            })
        }))
    }

    async deleteById(id: number) {
        let sqlQuery = `DELETE FROM activityzone WHERE posts.id LIKE ${id}`;
        return new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            })
        }))
    }

    async updateActivityZoneById(id: number, update: Partial<ActivityZoneProps>) {
        let errorObj = {response: false, type: "Ok"};
        if (!update.id_post && !update.codeDep) {
            throw new Error("No data");
        } else {
            const activity = await this.getById(id);
            if (activity.length === 0) {
                throw new Error("This id doesnt exist");
            } else {
                // TODO refactor this
                if (update.id_post !== undefined) {
                    activity[0].id_post = update.id_post;
                }
                if (update.codeDep !== undefined) {
                    activity[0].codeDep = update.codeDep;
                }
                const sqlQuery = `UPDATE posts SET codeDep = '${activity[0].codeDep}', id_post = ${activity[0].id_post} WHERE id = ${id}`;
                try {
                    await this.insertPromise(sqlQuery);
                    return errorObj;
                } catch (err) {
                    errorObj = {response: true, type: "Erreur de modification de la zone d'activité"}
                    return errorObj;
                }
            }
        }
    }

    async createActivityZone(idPost: number, codeDep: number[]): Promise<{ response: boolean; type: string }> {

        let errorObj = {response: false, type: "Ok"};
        if (!idPost || !codeDep) {
            throw new Error("Data missed");
        } else {
            for (let i = 0; i < codeDep.length; i++) {
                const sqlQuery = `INSERT INTO activityzone (id_post, codeDep) VALUES (${idPost}, '${codeDep[i]}')`;
                try {
                    await this.insertPromise(sqlQuery);
                } catch (error) {
                    errorObj = {response: true, type: "Erreur d'ajout de la zone d'activité"}
                }
            }
            return errorObj;
        }
    }
}