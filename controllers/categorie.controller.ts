import express, {Request, Response, Router} from "express";
import {AuthService} from "../services/auth.service";
import {checkUserConnected} from "../middlewares/auth.middleware";
import {CategorieService} from "../services/categorie.service";

import {SkillService} from "../services/skill.service";

import {CategorieProps} from "../models";



export class CategorieController {

    async getAll(req: Request, res: Response) {
        try {
            const categories = await CategorieService.getInstance().getAll();
            res.send({
                response: categories
            });
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }


    async getSkillByUser(req: Request, res: Response) {
        try {
            const skills = await SkillService.getInstance().getByUser(req.params.login);
            res.send({
                response: skills
            });
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async getSkillByUserId(req: Request, res: Response) {
        try {
            const skills = await SkillService.getInstance().getByUserId(req.params.id);
            res.send({
                response: skills
            });
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }
    async getSkillByPost(req: Request, res: Response) {
        try {
            const skills = await SkillService.getInstance().getByPost(req.params.id);
            res.send({
                response: skills
            });
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }
    async getSkillByCategorie(req: Request, res: Response) {
        try {
            const skills = await SkillService.getInstance().getByCategorie(parseInt(<string>req.params.idCategorie));
            res.send({
                response: skills
            });
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async getById(req: Request, res: Response) {
        let categorie;
        try {
            if (req.query.id) {
                categorie = await CategorieService.getInstance().getById(parseInt(<string>req.params.id));
            }
            if (categorie) {
                res.send({
                    response: categorie
                });
            }else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async createCategorie(req: Request, res: Response) {
        try {
            const categorie = await CategorieService.getInstance().add({
                name: req.body.name
            });
            if (categorie) {
                res.send({
                    response: categorie
                });
            }else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async updateCategorie(req: Request, res: Response) {
        try {
            const categorie = await CategorieService.getInstance().update({
                id: parseInt(<string>req.params.id),
                name: req.body.name
            });
            if (categorie) {
                res.send({
                    response: categorie
                });
            }else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async deleteCategorie(req: Request, res: Response) {
        try {
            const categorie = await CategorieService.getInstance().delete(parseInt(<string>req.params.id));
            if (categorie) {
                res.send({
                    response: categorie
                });
            }else {
                res.status(404).end();
            }

        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async certifySkill(req: Request, res: Response) {
        if (req.user !== undefined) {
            const role = await AuthService.getInstance().getRoleByUserId(req.user.id);
            if (role[0].role === "babysitter") {
                const isExist = await SkillService.getInstance().getById(parseInt(req.params.id));
                if (isExist) {
                    try{
                        await SkillService.getInstance().certify(parseInt(req.params.id), req.body.idDiplome, req.body.userName);
                        res.send({
                            response: true
                        }).status(200);
                    }
                    catch (err) {
                        console.log(err)
                        res.status(400).end(); // unauthorized
                    }
                } else {
                    console.log("skill not found");
                    res.status(404).end();
                }
            }
            if (req.user.role === "parent") {
                console.log("parent not allowed to certify skill");
                res.status(401).end(); // unauthorized
            }
        }
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.get('/getAllCategories', checkUserConnected(), this.getAll.bind(this));
        router.get('/getSkillsByUserLogin/:login', checkUserConnected(), this.getSkillByUser.bind(this));
        router.get('/getSkillsByUserId/:id', checkUserConnected(), this.getSkillByUserId.bind(this));
        router.get('/getSkillsByPost/:id', checkUserConnected(), this.getSkillByPost.bind(this));
        router.get('/getSkillsByCategorieId/:idCategorie', checkUserConnected(), this.getSkillByCategorie.bind(this));
        router.get('/:id',this.getById.bind(this));
        router.post('/create', express.json(), checkUserConnected(), this.createCategorie.bind(this));
        router.put('/update/:id', express.json(), checkUserConnected(), this.updateCategorie.bind(this));
        router.delete('/delete/:id', checkUserConnected(), this.deleteCategorie.bind(this));
        router.post('/certifySkill/:id', express.json(), checkUserConnected(), this.certifySkill.bind(this));

        return router;
    }
}

