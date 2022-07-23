import {QueryError, RowDataPacket} from "mysql2";
import {db} from "../utils/mysql.connector";
import {ContractProps} from "../models/ContractProps.model";


export class ContractService {

    private static instance?: ContractService;

    public static getInstance(): ContractService {
        if (ContractService.instance === undefined) {
            ContractService.instance = new ContractService();
        }
        return ContractService.instance;
    }

    private constructor() {
    }

    public async getAll() {
        let sqlQuery: string = "SELECT * FROM contracts";
        return new Promise<RowDataPacket[]>((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            });
        });
    }

    public async getById(id: number, idUser: number) {
        let sqlQuery = `SELECT * FROM contracts WHERE id LIKE ${id}`
        return new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error)
                }
                if (results.length === 0) {
                    return reject("No contract found")
                }
                if (results[0].idParent != idUser && results[0].idBabysitter != idUser) {
                    return reject("You are not allowed to see this contract")
                }
                return resolve(results);
            })
        }))
    }

    public async getByIdQrCode(id: number, idUser: number) {
        let sqlQuery = `SELECT * FROM contracts WHERE id LIKE ${id} AND step = 1`
        return new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error)
                }
                if (results.length === 0) {
                    return reject("No contract found")
                }
                if (results[0].idParent != idUser && results[0].idBabysitter != idUser) {
                    return reject("You are not allowed to see this contract")
                }
                return resolve(results);
            })
        }))
    }

    public async getByParent(parentId: number) {
        let sqlQuery = `SELECT * FROM contracts WHERE contracts.idParent LIKE ${parentId}`
        return new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error)
                }
                return resolve(results);
            })
        }))
    }

    public async getByBabysitter(babysitterId: number) {
        let sqlQuery = `SELECT * FROM contracts WHERE contracts.idBabysitter LIKE ${babysitterId}`
        return new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error)
                }
                return resolve(results);
            })
        }))
    }

    public async add(contract: ContractProps) {

        let sqlQueryExist = `SELECT * FROM contracts WHERE idParent LIKE ${contract.idParent} AND idBabysitter LIKE ${contract.idBabysitter} AND (step != 3 OR step != -1)`
         new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQueryExist, (error: QueryError, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error)
                }
                if (results.length > 0) {
                    return reject("You already have a contract with this babysitter")
                }
                return resolve(results);
            })
        }))

        contract.validateAt = new Date(new Date().toISOString());
        contract.startDate = new Date(new Date(contract.startDate).toISOString());
        contract.endDate = new Date(new Date(contract.endDate).toISOString());

        if (contract.startDate > contract.endDate) {
            throw new Error("Start date must be before end date");
        }
        if (contract.startDate < contract.validateAt) {
            throw new Error("Start date must be after validate date");
        }
        if (contract.endDate < contract.validateAt) {
            throw new Error("End date must be after validate date");
        }
        if (contract.numberOfHours <= 0) {
            throw new Error("Number of hours must be positive");
        }
        if (contract.hourlyWage <= 0) {
            throw new Error("Hourly wage must be positive");
        }

        if (new Date() > contract.startDate) {
            throw new Error("startDate must be in the future");
        }
        if (new Date() > contract.endDate) {
            throw new Error("endDate must be in the future");
        }

        //TODO: add qrCode
        contract.qrCode = 0;

        const validateDateString = contract.validateAt.toJSON().slice(0, 19).replace('T', ' ');
        const startDateString = contract.startDate.toJSON().slice(0, 19).replace('T', ' ');
        const endDateString = contract.endDate.toJSON().slice(0, 19).replace('T', ' ');

        let sqlQuery = `INSERT INTO contracts (idParent, idBabysitter, validateAt, numberOfHours, hourlyWage, qrCode, numberOfSitting, numberOfHourDone, startDate, endDate, step) VALUES (${contract.idParent}, ${contract.idBabysitter}, '${validateDateString}', ${contract.numberOfHours}, ${contract.hourlyWage}, ${contract.qrCode}, ${contract.numberOfSitting}, ${contract.numberOfHoursDone}, '${startDateString}', '${endDateString}', ${contract.step})`
        return new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error)
                }
                return resolve(results);
            })
        }))
    }

    public async update(contract: ContractProps) {
        let sqlQuery = `UPDATE contracts SET idParent = ${contract.idParent}, idBabysitter = ${contract.idBabysitter}, validateAt = '${contract.validateAt}', numberOfHours = ${contract.numberOfHours}, hourlyWage = ${contract.hourlyWage}, qrCode = '${contract.qrCode}', numberOfSitting = ${contract.numberOfSitting}, numberOfAttendance = ${contract.numberOfHoursDone}, startDate = '${contract.startDate}', endDate = '${contract.endDate}' WHERE id = ${contract.id}`
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
        let sqlQuery = `DELETE FROM contracts WHERE id = ${id}`
        return new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error)
                }
                return resolve(results);
            })
        }))
    }

    async updateStep(id: number, step: number) {
        if (step < -1 || step > 3) {
            throw new Error("Step must be between 0 and 3");
        }
        let sqlQuery = `UPDATE contracts SET step = ${step} WHERE id = ${id}`
        return new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error)
                }
                return resolve(results);
            })
        }))
    }

    async updateHoursDone(id: number, hours: number) {
        let resultSelect: RowDataPacket[] = [];
        if (hours <= 0 || hours > 24) {
            throw new Error("Hours must be positive");
        }
        // get numberOfHoursDone from contracts where id = id
        let sqlQuery1 = `SELECT * FROM contracts WHERE id = ${id}`
        new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery1, (error: QueryError, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error)
                }
                if (results.length == 0) {
                    return reject("Contract not found");
                }
                let numberOfHourDone = results[0].numberOfHourDone;
                sqlQuery1 = `UPDATE contracts SET numberOfHourDone = ${numberOfHourDone + hours} WHERE id = ${id}`
                db.query(sqlQuery1, (error: QueryError, results: RowDataPacket[]) => {
                    if (error) {
                        return reject(error)
                    }
                })
                sqlQuery1 = `SELECT * FROM contracts WHERE id = ${id}`

                db.query(sqlQuery1, (error: QueryError, results: RowDataPacket[]) => {
                    if (error) {
                        return reject(error)
                    }
                    if (results.length == 0) {
                        return reject("Contract not found");
                    }
                    resultSelect = results;
                })

            })
        }));
        return resultSelect;
    }

}