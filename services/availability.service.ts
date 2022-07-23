import {QueryError, RowDataPacket} from "mysql2";
import {db} from "../utils";
import {AvailabilityProps, Calendar, ListCalendar} from "../models";
import {RoleService} from "./role.service";
import {AuthService} from "./auth.service";

export class AvailabilityService {

    private static instance?: AvailabilityService;

    public static getInstance(): AvailabilityService {
        if (AvailabilityService.instance === undefined) {
            AvailabilityService.instance = new AvailabilityService();
        }
        return AvailabilityService.instance;
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
        let sqlQuery: string = "SELECT * FROM availability";
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
        let sqlQuery = `SELECT * FROM availability WHERE id LIKE ${id}`
        return new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error)
                }
                return resolve(results);
            })
        }))
    }

    public async getByUserId(userId: number) {
        let sqlQuery = `SELECT * FROM availability WHERE availability.idUser LIKE ${userId}`
        return new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error)
                }
                return resolve(results);
            })
        }))
    }

    public async parseAvailability(idUser: number) {
        let availabilityList = await AvailabilityService.getInstance().getByUserId(idUser);
        let listCalendat: ListCalendar = new ListCalendar([]);
        for (let i = 0; i < 24; i++) {
            let calendar: Calendar = new Calendar("", "", "", "", "", "", "");
            for (let availability of availabilityList) {
                if (i >= availability.startHour && i <= availability.endHour) {
                    switch (availability.day) {
                        case "lundi":
                            calendar.lundi = "X"
                            break;
                        case "mardi":
                            calendar.mardi = "X"
                            break;
                        case "mercredi":
                            calendar.mercredi = "X"
                            break;
                        case "jeudi":
                            calendar.jeudi = "X"
                            break;
                        case "vendredi":
                            calendar.vendredi = "X"
                            break;
                        case "samedi":
                            calendar.samedi = "X"
                            break;
                        case "dimanche":
                            calendar.dimanche = "X"
                            break;
                    }
                }
            }
            listCalendat.listCalendar.push(calendar);
        }
        return listCalendat;
    }

    public async getByPostId(postId: number) {
        let sqlQuery = `SELECT * FROM availability WHERE availability.idPost LIKE ${postId}`
        return new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error)
                }
                return resolve(results);
            })
        }))
    }

    public async add(availability: string[][], idUser: number | undefined , idPost: number | undefined) {
        if(idUser) {
            await AvailabilityService.getInstance().deleteAlllByUserId(idUser);
        }else if(idPost) {
            await AvailabilityService.getInstance().deleteAllByPostId(idPost);
        }
        for (let i = 0; i < availability.length; i++) {
            let inSeries: boolean = false
            let start: number = 0;
            let end: number = 0;
            for (let j = 1; j < availability[i].length; j++) {
                if(!inSeries && availability[i][j] === "X") {
                    if(j === 24) {
                        start = j - 1;
                        end = j - 1;
                        await this.insert(availability, idUser, idPost, start, end, i);
                    }
                    inSeries = true;
                    start = j - 1;
                    end = j - 1;
                } else if (inSeries && availability[i][j] === "X") {
                    end++;
                } else if ((inSeries && availability[i][j] !== "X")) {
                    inSeries = false;
                    await this.insert(availability, idUser, idPost, start, end, i);
                }
            }
        }
    }

    public async insert(availability: string [][], idUser: number | undefined , idPost: number | undefined, start : number, end : number, i : number) {
        if(idUser) {
            let sqlQuery = `INSERT INTO availability (idUser, day, startHour, endHour) VALUES (${idUser}, '${availability[i][0]}', ${start}, ${end})`;
            await AvailabilityService.getInstance().insertPromise(sqlQuery);
        }
        if(idPost) {
            let sqlQuery = `INSERT INTO availability (idPost, day, startHour, endHour) VALUES (${idPost}, '${availability[i][0]}', ${start}, ${end})`;
            await AvailabilityService.getInstance().insertPromise(sqlQuery);
        }
    }

    public async deleteAlllByUserId(idUser: number) {
        let sqlQuery = `DELETE FROM availability WHERE idUser = ${idUser}`
        return new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error)
                }
                return resolve(results);
            })
        }))
    }

    public async deleteAllByPostId(idPost: number) {
        let sqlQuery = `DELETE FROM availability WHERE idPost = ${idPost}`
        return new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error)
                }
                return resolve(results);
            })
        }))
    }

    public async delete(id: number) {
        let sqlQuery = `DELETE FROM availability WHERE id = ${id}`
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