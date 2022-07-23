import {UserProps} from "../models/UserProps";
import {db} from "../utils/mysql.connector";
import {SecurityUtils} from "../utils";
import {RowDataPacket} from "mysql2";
import {ContractService} from "./contract.service";

export class AuthService {

    private static instance?: AuthService;

    public static getInstance(): AuthService {
        if (AuthService.instance === undefined) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    private constructor() {
    }

    // #TODO modifier et découper cette fonction !!!

    public async subscribeUser(user: Partial<UserProps>): Promise<{ response: boolean; type: string }> {
        let errorObj = {response: false, type: ""}

        if (((!user.name || !user.lastname || !user.password || !user.login || !user.email) && user.role === "parent") ||
            ((!user.name || !user.lastname || !user.password || !user.login || !user.age || !user.sexe || !user.email) && user.role === "babysitter")) {
            throw new Error("Data Missed");
        } else {
            if (user.age && parseInt(String(user.age)) < 16) {
                errorObj = {response: true, type: "Age minimum 16 ans"}
                return errorObj;
            }
            if (user.login && user.password) {
                const userByLogin = await this.getUserByLogin(user.login);
                if (userByLogin.length != 0) {
                    errorObj = {response: true, type: "Le pseudo existe déjà"}
                    return errorObj;
                }
            } else {
                throw new Error("Data Missed");
            }
            let passwordString = SecurityUtils.sha512(user.password);
            let nameString = user.name;
            let lastNameString = user.lastname;
            let loginString = user.login;
            let roleString = user.role;
            let ageString = user.age;
            let sexeNumber = parseInt(String(user.sexe));
            let emailString = user.email;
            let photoString = "../../assets/avatar.png";

            const sql = `INSERT INTO users (name, lastname,password,login,id_role,age,sexe,email, photo) VALUES ('${nameString}', '${lastNameString}','${passwordString}','${loginString}',
            (SELECT id FROM role WHERE role = '${roleString}'), '${ageString}', '${sexeNumber}',  '${emailString}', '${photoString}')`;
            try {
                await this.insertPromise(sql);
                return errorObj;
            } catch (error) {
                errorObj = {response: true, type: "Erreur inscription"}
                return errorObj;
            }
        }
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

    public async logIn(data: Pick<UserProps, 'login' | 'password'>): Promise<string> {
        if (!data.login || !data.password) {
            throw new Error("Data Missed");
        }
        let login = data.login;
        let password = SecurityUtils.sha512(data.password);
        try {
            let resultQuery = await this.getUserByLoginPass(login, password);
            if (resultQuery.length > 0) {
                const user_id = resultQuery[0].id;
                let token = SecurityUtils.generateToken();
                let sql = "INSERT INTO sessions (token, id_user) VALUES ('" + token + "','" + user_id + "')";
                try {
                    await this.insertPromise(sql);
                    return token;
                } catch (error) {
                    console.log(error);
                    throw new Error("Error in insert session");
                }
            }
            throw new Error("User not found");
        } catch (error) {
            throw new Error("SQl error" + error);
        }
    }

    public async logInQrCode(data: { login: string, password: string, idBabysitter: number, idContract: number }): Promise<string> {
        if (!data.login || !data.password) {
            throw new Error("Data Missed");
        }
        let login = data.login;
        let password = SecurityUtils.sha512(data.password);
        try {
            let resultQuery = await this.getUserByLoginPass(login, password);
            const user_id = resultQuery[0].id;
            if (resultQuery.length > 0) {
                const role = await AuthService.getInstance().getRoleByUserId(user_id);
                if (role[0].role != "parent") {
                    throw new Error("Vous n'êtes pas un parent");
                }
                const contract = await ContractService.getInstance().getByIdQrCode(data.idContract, user_id);
                if (contract) {
                    if (contract[0].id != data.idContract) {
                        throw new Error("Vous n'êtes pas le parent de ce contrat");
                    }
                    if (contract[0].idParent != user_id) {
                        throw new Error("Vous n'êtes pas le parent de ce contrat");
                    }
                    if (contract[0].idBabysitter != data.idBabysitter) {
                        throw new Error("Erreur avec le babysitter");
                    }
                } else {
                    throw new Error("Contrat non trouvé");
                }
                return role[0].role;
            } else {
                throw new Error("User not found");
            }
        } catch (error) {
            throw new Error("SQl error" + error);
        }
    }

    public async getUserByLogin(login: string) {
        const sql = `SELECT * FROM users WHERE login = '${login}'`;
        return new Promise<RowDataPacket[]>((resolve, reject) => {
            db.query(sql, (error, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            });
        });
    }

    public async getUserByLoginPass(login: string, password: string) {
        const sql = `SELECT * FROM users WHERE login = '${login}' AND password = '${password}' AND (banned is NULL OR banned = 0)`;
        return new Promise<RowDataPacket[]>((resolve, reject) => {
            db.query(sql, (error, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            });
        });
    }

    public async getRoleByUserId(id: string) {
        const sql = `SELECT role.role, users.login FROM role INNER JOIN users on role.id = users.id_role where users.id =${parseInt(id)}`;
        return new Promise<RowDataPacket[]>((resolve, reject) => {
            db.query(sql, (error, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            });
        });
    }

    public async getUserByToken(token: string) {
        const sql = `SELECT id_user FROM sessions WHERE token = '${token}'`;
        return new Promise<RowDataPacket[]>((resolve, reject) => {
            db.query(sql, (error, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            });
        });
    }

    async getUserById(userId: number) {
        const sql = `SELECT * FROM users WHERE id = '${userId}'`;
        return new Promise<RowDataPacket[]>((resolve, reject) => {
            db.query(sql, (error, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            });
        });
    }

    async getUserByEmail(email: string) {
        const sql = `SELECT * FROM users WHERE email = '${email}'`;
        return new Promise<RowDataPacket[]>((resolve, reject) => {
            db.query(sql, (error, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            });
        });
    }

    async getUserByRole(role: string) {
        const sql = `SELECT * FROM users WHERE id_role = (SELECT id FROM role WHERE role = '${role}')`;
        return new Promise<RowDataPacket[]>((resolve, reject) => {
            db.query(sql, (error, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            });
        });
    }

    async getFirstConnexion(id_user: any) {
        const sql = `SELECT id_user FROM sessions WHERE id_user = '${id_user}'`;
        return new Promise<RowDataPacket[]>((resolve, reject) => {
            db.query(sql, (error, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            });
        });
    }

    async updateBabysitter(data: Pick<UserProps, 'id' | 'photo' | 'description'>) {
        if (!data.id) {
            throw new Error("Data Missed");
        }
        let photoString = data.photo;
        let descriptionString = data.description;
        let id_user = data.id;

        let resultQuery = await this.getUserById(id_user);
        if (resultQuery.length > 0) {
            if (!photoString) {
                photoString = resultQuery[0].photo;
            }
            if (!descriptionString) {
                descriptionString = resultQuery[0].description;
            }
        }
        let sql = `UPDATE users SET photo = '${photoString}', description = '${descriptionString}' WHERE id = '${id_user}'`;
        return new Promise<RowDataPacket[]>((resolve, reject) => {
            db.query(sql, (error, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            });
        });
    }

    async updateUser(data: Pick<UserProps, 'id' | 'sexe' | 'name' | 'lastname' | 'email' | 'description' | 'age'>) {
        if (!data.id || !data.name || !data.lastname || !data.email || !data.sexe) {
            throw new Error("Data Missed");
        }
        let descriptionString = data.description;
        let id_user = data.id;
        let nameString = data.name;
        let lastnameString = data.lastname;
        let emailString = data.email;
        let ageNumber = data.age;

        let resultQuery = await this.getUserById(id_user);

        if (resultQuery.length <= 0) {
            throw new Error("User not found");
        }

        let sql = `UPDATE users SET name = '${nameString}', lastname = '${lastnameString}', email = '${emailString}', age = '${ageNumber}', description = '${descriptionString}' WHERE id = '${id_user}'`;
        return new Promise<RowDataPacket[]>((resolve, reject) => {
            db.query(sql, (error, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            });
        });
    }

    async updateSkillsBabysitter(param: { arraySkills: any, id: number }) {
        let arraySkills = param.arraySkills;
        for (let i = 0; i < arraySkills.length; i++) {
            let sql = `UPDATE skills SET name = '${arraySkills[i].skill}',
            idCategorie =  (SELECT id FROM categories WHERE name = '${arraySkills[i].category}')
            WHERE idUser = ${param.id} AND id = ${arraySkills[i].id}`;
            try {
                await this.insertPromise(sql);
            } catch (error) {
                console.log(error);
                throw new Error("Error in update session");
            }
        }
    }

    async insertSkillsBabysitter(param: { arraySkills: any, id: number }) {
        let arraySkills = param.arraySkills;
        for (let i = 0; i < arraySkills.length; i++) {
            let sql = `INSERT INTO skills (idUser, idCategorie, name) VALUES (
            '${(param.id)}',
            (SELECT id FROM categories WHERE name = '${arraySkills[i].category}'),
            '${arraySkills[i].skill}')`;
            try {
                await this.insertPromise(sql);
            } catch (error) {
                console.log(error);
                throw new Error("Error in insert session");
            }
        }
    }

    async getAllUsersNonBanned() {
        const sql = `SELECT * FROM users WHERE banned = 0 OR banned IS NULL`;
        return new Promise<RowDataPacket[]>((resolve, reject) => {
            db.query(sql, (error, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            });
        });
    }

    async getAllUsers() {
        const sql = `SELECT * FROM users`;
        return new Promise<RowDataPacket[]>((resolve, reject) => {
            db.query(sql, (error, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            });
        });
    }

    deleteSkillsBabysitter(id: string) {
        let sql = `DELETE FROM skills WHERE id = ${id}`;
        return new Promise<RowDataPacket[]>((resolve, reject) => {
            db.query(sql, (error, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            });
        });
    }

    async getUsersByCategoryId(categorieId: number) {
        let sql = `SELECT * FROM users`;
        let users = await new Promise<RowDataPacket[]>((resolve, reject) => {
            db.query(sql, (error, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error);
                }

                return resolve(results);

            });
        });

        for (let i = 0; i < users.length; i++) {
            let sqlSkill = `SELECT * FROM skills WHERE idUser = ${users[i].id}`;
            let skills = await new Promise<RowDataPacket[]>((resolve, reject) => {
                db.query(sqlSkill, (error, results: RowDataPacket[]) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                });
            });

            let flag = false;
            for (let j = 0; j < skills.length; j++) {
                if (skills[j].idCategorie === categorieId) {
                    flag = true;
                }
            }
            if (!flag) {
                users.splice(i, 1);
                i--;
            }
        }
        return users;
    }

    async getUsersBySkillId(skillId: number) {
        let sql = `SELECT * FROM users`;
        let users = await new Promise<RowDataPacket[]>((resolve, reject) => {
            db.query(sql, (error, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error);
                }

                return resolve(results);

            });
        });

        for (let i = 0; i < users.length; i++) {
            let sqlSkill = `SELECT * FROM skills WHERE idUser = ${users[i].id}`;
            let skills = await new Promise<RowDataPacket[]>((resolve, reject) => {
                db.query(sqlSkill, (error, results: RowDataPacket[]) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                });
            });

            for (let j = 0; j < skills.length; j++) {
                if (skills[j].id !== skillId) {
                    users.splice(i, 1);
                    i--;
                    break;
                }
            }
        }
        return users;
    }


    async deleteUser(userId: number) {
        let sql = `DELETE FROM users WHERE id = ${userId}`;
        return new Promise<RowDataPacket[]>((resolve, reject) => {
            db.query(sql, (error, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            });
        });
    }
}


