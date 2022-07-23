import express, {Request, Response, Router} from "express";
import {AuthService, CategorieService, PostService, SignalementService, SkillService} from "../services";
import {checkAdminConnected} from "../middlewares/admin.middleware";
import {AdminService} from "../services/admin.service";

export class AdminController {

    public async getAllUsers(req: Request, res: Response) {
        try {
            const users = await AuthService.getInstance().getAllUsers();
            if (users) {
                res.send({
                    response: users
                });
            }else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(400).end(); // bad request
        }
    }

    public async getUserById(req: Request, res: Response) {
        try {
            const user = await AuthService.getInstance().getUserById(parseInt(req.params.id));

            if (user) {
                res.send({
                    user: user[0]
                })
            }else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(400).end(); // bad request
        }
    }

    public async getAllCategories(req: Request, res: Response) {
        try {
            const categories = await CategorieService.getInstance().getAll();
            if (categories) {
                res.send({
                    response: categories
                });
            }else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(400).end(); // bad request
        }
    }

    public async getCategoryById(req: Request, res: Response) {
        try {
            const category = await CategorieService.getInstance().getById(parseInt(req.params.id));
            if (category) {
                res.send({
                    response: category
                });
            }else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(400).end(); // bad request
        }
    }

    public async getUsersByCategoryId(req: Request, res: Response) {
        try {
            const users = await AuthService.getInstance().getUsersByCategoryId(parseInt(req.params.id));
            if (users) {
                res.send({
                    response: users
                });
            }else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(400).end(); // bad request
        }
    }

    public async getSkillsByCategoryId(req: Request, res: Response) {
        try {
            const skills = await SkillService.getInstance().getByCategorie(parseInt(req.params.id));
            if (skills) {
                res.send({
                    response: skills
                });
            }else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(400).end(); // bad request
        }
    }

    public async getAllSkills(req: Request, res: Response) {
        try {
            const skills = await SkillService.getInstance().getAll();
            if (skills) {
                res.send({
                    response: skills
                });
            }else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(400).end(); // bad request
        }
    }

    public async getSkillById(req: Request, res: Response) {
        try {
            const skill = await SkillService.getInstance().getById(parseInt(req.params.id));
            if (skill) {
                res.send({
                    response: skill
                });
            }else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(400).end(); // bad request
        }
    }

    public async getUsersBySkillId(req: Request, res: Response) {
        try {
            const users = await AuthService.getInstance().getUsersBySkillId(parseInt(req.params.id));
            if (users) {
                res.send({
                    response: users
                });
            }else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(400).end(); //  bad request
        }
    }

    public async getAllPosts(req: Request, res: Response) {
        try {
            const posts = await PostService.getInstance().getAll();
            if (posts) {
                res.send({
                    response: posts
                });
            }else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(400).end(); // bad request
        }
    }

    public async getPostById(req: Request, res: Response) {
        try {
            const post = await PostService.getInstance().getById(parseInt(req.params.id));
            if (post) {
                res.send({
                    response: post
                });
            }else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(400).end(); // bad request
        }
    }

    public async getPostsByUserId(req: Request, res: Response) {
        try {
            const posts = await PostService.getInstance().getByUser(parseInt(req.params.id));
            if (posts) {
                res.send({
                    response: posts
                });
            }else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(400).end(); // bad request
        }
    }

    public async getPostsByCategoryId(req: Request, res: Response) {
        try {
            const posts = await PostService.getInstance().getByCategory(parseInt(req.params.id));
            if (posts) {
                res.send({
                    response: posts
                });
            }else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(400).end(); // bad request
        }
    }

    public async getPostsBySkillId(req: Request, res: Response) {
        try {
            const posts = await PostService.getInstance().getBySkill(parseInt(req.params.id));
            if (posts) {
                res.send({
                    response: posts
                });
            }else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(400).end(); // bad request
        }
    }

    public async deleteUserById(req: Request, res: Response) {
        try {
            const user = await AuthService.getInstance().deleteUser(parseInt(req.params.id));
            if (user) {
                res.send({
                    response: user
                });
            }else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(400).end(); // bad request
        }
    }

    public async deletePostById(req: Request, res: Response) {
        try {
            const post = await PostService.getInstance().deleteById(parseInt(req.params.id));
            if (post) {
                res.send({
                    response: post
                });
            }else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(400).end(); // bad request
        }
    }

    public async deleteCategorieById(req: Request, res: Response) {
        try {
            const category = await CategorieService.getInstance().delete(parseInt(req.params.id));
            if (category) {
                res.send({
                    response: category
                });
            }else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(400).end(); // bad request
        }
    }

    public async deleteSkillById(req: Request, res: Response) {
        try {
            const skill = await SkillService.getInstance().delete(parseInt(req.params.id));
            if (skill) {
                res.send({
                    response: skill
                });
            }else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(400).end(); // bad request
        }
    }

    public async getAllSignalements(req: Request, res: Response) {
        try {
            const signalements = await SignalementService.getInstance().getAll();
            if (signalements) {
                res.send({
                    response: signalements
                });
            }else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(400).end(); // bad request
        }
    }

    public async checkAdmin(req: Request, res: Response) {
        res.send({
            response: true
        });

    }

    public async getSignalementByIdProfile(req: Request, res: Response) {
        try {
            const signalement = await SignalementService.getInstance().getByProfileId(parseInt(req.params.id));
            if (signalement) {
                res.send({
                    response: signalement
                });
            }else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(400).end(); // bad request
        }
    }

    public async banUser(req: Request, res: Response) {
        try {
            const user = await AdminService.getInstance().ban(parseInt(req.body.id));
            if (user) {
                res.send(user);
            }else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(400).end(); // bad request
        }
    }

    public async unbanUser(req: Request, res: Response) {
        try {
            const user = await AdminService.getInstance().unBan(parseInt(req.body.id));
            if (user) {
                res.send(user);
            }else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(400).end(); // bad request
        }
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.get('/', checkAdminConnected(), this.checkAdmin.bind(this));
        router.get("/users", checkAdminConnected(), this.getAllUsers.bind(this));
        router.get("/users/:id", checkAdminConnected(), this.getUserById.bind(this));
        router.get("/users/categories/:id", checkAdminConnected(), this.getUsersByCategoryId.bind(this));
        router.get("/users/skills/:id", checkAdminConnected(), this.getUsersBySkillId.bind(this));
        router.get("/posts", checkAdminConnected(), this.getAllPosts.bind(this));
        router.get("/posts/:id", checkAdminConnected(), this.getPostById.bind(this));
        router.get("/post/user/:id", checkAdminConnected(), this.getPostsByUserId.bind(this));
        router.get("/posts/categories/:id", checkAdminConnected(), this.getPostsByCategoryId.bind(this));
        router.get("/posts/skills/:id", checkAdminConnected(), this.getPostsBySkillId.bind(this));
        router.get("/categories", checkAdminConnected(), this.getAllCategories.bind(this));
        router.get("/categories/:id", checkAdminConnected(), this.getCategoryById.bind(this));
        router.get("/skills", checkAdminConnected(), this.getAllSkills.bind(this));
        router.get("/skills/:id", checkAdminConnected(), this.getSkillById.bind(this));
        router.get("/skills/categories/:id", checkAdminConnected(), this.getSkillsByCategoryId.bind(this));
        router.get("/signalements", checkAdminConnected(), this.getAllSignalements.bind(this));
        router.get("/signalements/profile/:id", checkAdminConnected(), this.getSignalementByIdProfile.bind(this));
        router.delete("/users/delete/:id", checkAdminConnected(), this.deleteUserById.bind(this));
        router.delete("/posts/delete/:id", checkAdminConnected(), this.deletePostById.bind(this));
        router.delete("/categories/delete/:id", checkAdminConnected(), this.deleteCategorieById.bind(this));
        router.delete("/skills/delete/:id", checkAdminConnected(), this.deleteSkillById.bind(this));
        router.put("/users/banUser", checkAdminConnected(), express.json(), this.banUser.bind(this));
        router.put("/users/unbanUser", checkAdminConnected(), express.json(), this.unbanUser.bind(this));
        return router;
    }
}