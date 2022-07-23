import {QueryError, RowDataPacket} from "mysql2";
import {db} from "../utils/mysql.connector";
import {PostProps} from "../models";
import {AuthService} from "./auth.service";
import {AvailabilityService} from "./availability.service";
import {type} from "os";

export class PostService {

    private static instance?: PostService;

    public static getInstance(): PostService {
        if (PostService.instance === undefined) {
            PostService.instance = new PostService();
        }
        return PostService.instance;
    }

    public async getAll() {
        let sqlQuery: string = "SELECT * FROM posts";
        return new Promise<RowDataPacket[]>((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            });
        });
    }

    public async getLastByUserId(idUser: number) {
        let sqlQuery: string = `SELECT * FROM posts where idUser = ${idUser} ORDER BY id DESC LIMIT 1`;
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
        let sqlQuery = `SELECT * FROM posts WHERE id LIKE ${id}`;
        return new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            })
        }))
    }

    public async getByUser(userId: number) {
        let sqlQuery = `SELECT * FROM posts WHERE posts.idUser LIKE ${userId}`;
        return new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            })
        }))
    }

    public async add(post: PostProps) {
        let sqlQuery = `INSERT INTO posts (idUser, city-code, hourlyWage, description, ageChild, numberChild, type) VALUES (${post.idUser}, '${post.cityCode}', ${post.hourlyWage}, '${post.description}', ${post.ageChild}, ${post.numberChild}, ${post.type})`;
        return new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error)
                }
                return resolve(results);
            })
        }))
    }

    public async createParentPost(post: Partial<PostProps>): Promise<{ response: boolean; type: string }> {
        let errorObj = {response: false, type: "Ok"};
        if (!post.idUser || !post.cityCode || !post.hourlyWage || !post.description || !post.numberChild) {
            throw new Error("Data missed");
        } else {
            // check if description contains "'" and put "\" before
            const description = post.description.replace(/'/g, "\\'");
            const type = "parent";
            const sqlQuery = `INSERT INTO posts (idUser, \`city-code\`, hourlyWage, description, ageChild, numberChild, type) VALUES (${post.idUser}, '${post.cityCode}', ${post.hourlyWage}, '${description}', ${post.ageChild}, ${post.numberChild}, '${type}')`;
            try {
                await this.insertPromise(sqlQuery);
                return errorObj;
            } catch (error) {
                errorObj = {response: true, type: "Erreur d'ajout du post"}
                return errorObj;
            }
        }
    }

    public async createBabyTeacherPost(post: Partial<PostProps>): Promise<{ response: boolean; type: string }> {
        let errorObj = {response: false, type: "Ok"};
        if (!post.idUser || !post.hourlyWage || !post.description) {
            throw new Error("Data missed");
        } else {
            const description = post.description.replace(/'/g, "\\'");
            const type = "babysitter";
            const sqlQuery = `INSERT INTO posts (idUser, hourlyWage, description, type) VALUES (${post.idUser}, ${post.hourlyWage}, '${description}', '${type}')`;
            try {
                await this.insertPromise(sqlQuery);
                return errorObj;
            } catch (error) {
                errorObj = {response: true, type: "Erreur d'ajout du post"}
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

    async updateParentById(id: number, update: Partial<PostProps>) {
        let errorObj = {response: false, type: "Ok"};
        if (!update.cityCode && !update.hourlyWage && !update.description && !update.ageChild && !update.numberChild) {
            throw new Error("No data");
        } else {
            const post = await this.getById(id);
            if (post.length === 0) {
                throw new Error("This id doesnt exist");
            } else {
                // TODO refactor this
                if (update.cityCode !== undefined) {
                    post[0].city = update.cityCode;
                }
                if (update.hourlyWage !== undefined) {
                    post[0].hourlyWage = update.hourlyWage;
                }
                if (update.description !== undefined) {
                    const description = update.description.replace(/'/g, "\\'");
                    post[0].description = description;
                }
                if (update.ageChild !== undefined) {
                    post[0].ageChild = update.ageChild;
                }
                if (update.numberChild !== undefined) {
                    post[0].numberChild = update.numberChild;
                }
                const sqlQuery = `UPDATE posts SET city = '${post[0].city}', hourlyWage = ${post[0].hourlyWage}, description = '${post[0].description}', ageChild = ${post[0].ageChild}, numberChild = ${post[0].numberChild} WHERE id = ${id}`;
                try {
                    await this.insertPromise(sqlQuery);
                    return errorObj;
                } catch (err) {
                    errorObj = {response: true, type: "Erreur de modification du post"}
                    return errorObj;
                }
            }
        }
    }

    async updateBabysitterById(id: number, update: Partial<PostProps>) {
        let errorObj = {response: false, type: "Ok"};
        if (!update.idUser && !update.hourlyWage && !update.description) {
            throw new Error("No data");
        } else {
            if (update.description) {
                const description = update.description.replace(/'/g, "\\'");
            }
            const post = await this.getById(id);
            if (post.length === 0) {
                throw new Error("This id doesnt exist");
            } else {
                // TODO refactor this
                if (update.hourlyWage !== undefined) {
                    post[0].hourlyWage = update.hourlyWage;
                }
                if (update.description !== undefined) {
                    post[0].description = update.description.replace(/'/g, "\\'");
                }
                const sqlQuery = `UPDATE posts SET activityZone = '${post[0].activityZone}', hourlyWage = ${post[0].hourlyWage}, description = '${post[0].description}' WHERE id = ${id}`;
                try {
                    await this.insertPromise(sqlQuery);
                    return errorObj;
                } catch (err) {
                    errorObj = {response: true, type: "Erreur de modification du post"}
                    return errorObj;
                }
            }
        }
    }

    async deleteById(id: number) {
        let sqlQuery = `DELETE FROM posts WHERE posts.id LIKE ${id}`;
        return new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            })
        }))
    }

    async getByCategory(categorieId: number) {
        let sqlQuery = `SELECT * FROM posts WHERE posts.idCategory LIKE ${categorieId}`;
        let posts = await new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            })
        }));
        let users = await AuthService.getInstance().getUsersByCategoryId(categorieId);
        for (let i = 0; i < posts.length; i++) {
            let user = await AuthService.getInstance().getUserById(posts[i].idUser);
            if (!users.includes(user[0])) {
                posts.splice(i, 1);
                i--;
            }
        }
        return posts;
    }

    async getBySkill(skillId: number) {
        let sqlQuery = `SELECT * FROM posts WHERE posts.idSkill LIKE ${skillId}`;
        let posts = await new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            })
        }));
        let users = await AuthService.getInstance().getUsersBySkillId(skillId);
        for (let i = 0; i < posts.length; i++) {
            let user = await AuthService.getInstance().getUserById(posts[i].idUser);
            if (!users.includes(user[0])) {
                posts.splice(i, 1);
                i--;
            }
        }
        return posts;
    }

    private async getPostsByActivityZone(role: string, activityZone: number[]) {
        let posts: any[] = [];
        let postsByactivityZone: any[] = [];
        if (role === 'babysitter') {
            for (let i = 0; i < activityZone.length; i++) {
                //get all posts by activityZone
                let result = await this.getByCityCode(activityZone[i]);
                posts.push(result)
            }
        }
        if (role === 'parent') {
            for (let i = 0; i < activityZone.length; i++) {
                //get all posts by activityZone
                let result = await this.getByActivityZone(activityZone[i]);
                posts.push(result)
            }
        }
        for (let i = 0; i < posts.length; i++) {
            for (let j = 0; j < posts[i].length; j++) {
                postsByactivityZone.push(posts[i][j]);
            }
        }
        return postsByactivityZone;
    }

    async searchPost(param: { activityZone: number[]; skill: string[]; availability: string[]; category: string[], role: string }) {
        let postByAvailabilityParent = [];
        let postByAvailabilityBabysitter = [];
        let currentPosts: RowDataPacket[] = [];
        let last: RowDataPacket[] = [];
        let postsByactivityZone = await this.getPostsByActivityZone(param.role, param.activityZone);
        //si pas de post par activityZone et role return null
        if (postsByactivityZone.length <= 0) {
            return null;
        }
        if (param.role === "parent") {
            postByAvailabilityParent = await this.getPostByAvailabilityParent(postsByactivityZone, param.availability);
            currentPosts = postByAvailabilityParent;
        }
        if (param.role === "babysitter") {
            postByAvailabilityBabysitter = await this.getPostByAvailabilityBabysitter(postsByactivityZone, param.availability);
            currentPosts = postByAvailabilityBabysitter;
        }
        let postBySkills = await this.getPostBySkill(currentPosts, param.skill);
        let postBySkilCategory = await this.getPostBySkillCategory(currentPosts, param.category);
        // 100% de correspondance
        this.pushInArray(postBySkills, last);
        // 75% de correspondance
        this.pushInArray(postBySkilCategory, last);
        // 50% de correspondance
        this.pushInArray(currentPosts, last);
        // 25% de correspondance
        this.pushInArray(postsByactivityZone, last);
        // 25 % de correspondance
        if (param.role === "babysitter") {
            this.pushInArray(postByAvailabilityBabysitter, last);
        }
        if (param.role === "parent") {
            this.pushInArray(postByAvailabilityParent, last);
        }
        return last;
    }

    pushInArray(current: any[], last: RowDataPacket[]) {
        if (current[0]) {
            if (current[0].idPost === undefined) {
                current = current[0];
            }
        }
        if (current.length > 0) {
            for (let i = 0; i < current.length; i++) {
                let checkPost: boolean = true;
                if (current[i].id || current[i].idPost) {
                    if (last.includes(current[i].id) || last.includes(current[i].idPost)) {
                        checkPost = false;
                    }
                    if (checkPost) {
                        if (current[i].idPost) {
                            last.push(current[i].idPost);
                        } else {
                            last.push(current[i].id);
                        }
                    }
                }
            }
        }
        return last;
    }

    async getPostBySkillById(id: number, name: string) {
        let sqlQuery = `select posts.id from posts inner join skills ON posts.id = skills.idPost WHERE skills.name = '${name}' AND skills.idPost = ${id}`;
        let posts = await new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            })
        }));
        return posts;
    }

    async getPostByCategoryById(id: number, name: string) {
        let sqlQuery = `select posts.id from posts 
        inner join skills ON posts.id = skills.idPost
        inner join categories ON skills.idCategorie = categories.id
        WHERE skills.idPost = ${id} and categories.name = '${name}'`;
        let postsCategory = await new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            })
        }));
        return postsCategory;
    }

    private async getByCityCode(code: number) {
        //let sqlQuery = `SELECT max(posts.id) as idPost,idUser, city-code,hourlyWage,description,ageChild,numberChild,type FROM posts WHERE \`city-code\` LIKE '${code}%' GROUP BY idUser, city-code`;

        let sqlQuery = `SELECT max(posts.id) as idPost, idUser, \`city-code\`, hourlyWage, description, ageChild, numberChild, \`type\` FROM posts WHERE \`city-code\` LIKE '${code}%' GROUP BY idUser, \`city-code\`, hourlyWage, description, ageChild, numberChild, \`type\``;
        let posts = await new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            })
        }));
        return posts;
    }

    private async getByActivityZone(code: number) {

        let sqlQuery = `SELECT max(posts.id) as idPost,idUser, \`city-code\` ,hourlyWage,description,ageChild,numberChild,type, activityzone.codeDep from posts INNER JOIN activityzone ON posts.id = activityzone.id_post  where activityzone.codeDep = '${code}' GROUP BY idUser, idUser, \`city-code\` ,hourlyWage,description,ageChild,numberChild,type, activityzone.codeDep`;

        let posts = await new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            })
        }));
        return posts;
    }

    private async getPostByAvailabilityParent(postsByactivityZone: any[], availability: string[]) {
        let postByAvailabilityParent = [];
        for (let i = 0; i < postsByactivityZone.length; i++) {
            let checkPostAvailability: boolean = false;
            let userAvaibality = await AvailabilityService.getInstance().getByUserId(postsByactivityZone[i].idUser);
            if (userAvaibality !== null) {
                for (let j = 0; j < userAvaibality.length; j++) {
                    if (availability.includes(userAvaibality[j].day)) {
                        checkPostAvailability = true;
                    }
                }
            }
            if (checkPostAvailability) {
                postByAvailabilityParent.push(postsByactivityZone[i]);
            }
        }
        return postByAvailabilityParent;
    }

    private async getPostByAvailabilityBabysitter(postsByactivityZone: any[], availability: string[]) {
        let postByAvailabilityBabysitter = [];
        for (let i = 0; i < postsByactivityZone.length; i++) {
            let checkPostAvailability: boolean = false;
            let postAvaibality = await AvailabilityService.getInstance().getByPostId(postsByactivityZone[i].idPost);
            if (postAvaibality !== null) {
                for (let j = 0; j < postAvaibality.length; j++) {
                    if (availability.includes(postAvaibality[j].day)) {
                        checkPostAvailability = true;
                    }
                }
            }
            if (checkPostAvailability) {
                postByAvailabilityBabysitter.push(postsByactivityZone[i]);
            }
        }
        return postByAvailabilityBabysitter;
    }

    private async getPostBySkillCategory(currentPosts: RowDataPacket[], category: string[]) {
        let postBySkilCategory = [];
        for (let i = 0; i < currentPosts.length; i++) {
            for (let j = 0; j < category.length; j++) {
                let result = await this.getPostByCategoryById(currentPosts[i].idPost, category[j])
                postBySkilCategory.push(result);
            }
        }
        return postBySkilCategory;
    }

    private async getPostBySkill(currentPosts: RowDataPacket[], skill: string[]) {
        let postBySkills = [];
        for (let i = 0; i < currentPosts.length; i++) {
            for (let j = 0; j < skill.length; j++) {
                let result = await this.getPostBySkillById(currentPosts[i].idPost, skill[j])
                postBySkills.push(result);
            }
        }
        return postBySkills;
    }

    async updateUserById(idUser:number, idPost:number, hourlyWage : number, description:string) {
        let sqlQuery = `UPDATE posts SET idUser = ${idUser}, hourlyWage = ${hourlyWage}, description = '${description}' WHERE id = ${idPost}`;
        return  await new Promise<RowDataPacket[]>(((resolve, reject) => {
            db.query(sqlQuery, (error: QueryError, results: RowDataPacket[]) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            })
        }));
    }
}