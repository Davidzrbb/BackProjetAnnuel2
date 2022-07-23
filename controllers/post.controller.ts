import express, {Request, Response, Router} from "express";
import {AuthService, AvailabilityService, ActivtyZoneService, CategorieService, SkillService} from "../services";
import {checkUserConnected} from "../middlewares";
import {PostService} from "../services";

export class PostController {

    async deletePost(req: Request, res: Response) {
        const isExist = await PostService.getInstance().getById(parseInt(req.params.id));
        if (isExist.length !== 0) {
            try {
                if (isExist[0].type === "parent") {
                    await AvailabilityService.getInstance().deleteAllByPostId(parseInt(req.params.id));
                } else {
                    await ActivtyZoneService.getInstance().deleteByPostId(parseInt(req.params.id));
                }
                const post = await PostService.getInstance().deleteById(parseInt(req.params.id));
                res.status(204).json(post);
            } catch (err) {
                console.log(err);
                res.status(400).json(err);
            }
        } else {
            console.log("This post id doesn't exists")
            res.status(404).end();
        }
    }

    async show(req: Request, res: Response) {
        const isExist = await PostService.getInstance().getById(parseInt(req.params.id));
        if (isExist.length !== 0) {
            try {
                res.json({
                    response: isExist[0]
                });
            } catch (err) {
                console.log(err);
                res.status(400).json(err);
            }
        } else {
            console.log("This post id doesn't exists")
            res.status(404).end();
        }
    }

    async getByUserId(req: Request, res: Response) {
        const isExist = await PostService.getInstance().getByUser(parseInt(req.params.id));
        if (isExist.length !== 0) {
            try {
                res.json({
                    response: isExist
                });
            } catch (err) {
                console.log(err);
                res.status(400).json(err);
            }
        } else {
            console.log("This post id doesn't exists")
            res.status(404).end();
        }
    }

    async all(req: Request, res: Response) {
        try {
            const allPost = await PostService.getInstance().getAll();
            res.json({
                response: allPost
            });
        } catch (err) {
            console.log(err);
            res.status(400).json(err);
        }
    }

    async updatePost(req: Request, res: Response) {
        if (req.user !== undefined) {
            const isExists = await PostService.getInstance().getById(parseInt(req.params.id));
            const role = await AuthService.getInstance().getRoleByUserId(req.user.id);
            if (isExists) {
                if (role[0].role === "parent") {
                    try {
                        const post = await PostService.getInstance().updateParentById(parseInt(req.params.id), req.body);
                        await AvailabilityService.getInstance().add(req.body.availability, req.user.id, parseInt(req.params.id));
                        res.json(post);
                    } catch (err) {
                        console.log(err);
                        res.status(400).json(err);
                    }
                }
                if (role[0].role === "babysitter") {
                    try {
                        const post = await PostService.getInstance().updateBabysitterById(parseInt(req.params.id), req.body);
                        await ActivtyZoneService.getInstance().createActivityZone(parseInt(req.params.id), req.body.codeDep);
                        res.json(post);
                    } catch (err) {
                        console.log(err);
                        res.status(400).json(err);
                    }
                }
            } else {
                console.log("This post id doesn't exists")
                res.sendStatus(404).end();
            }
        }
    }

    async updatePostUser(req: Request, res: Response) {
        if (req.user !== undefined) {
            const isExists = await PostService.getInstance().getById(req.body.idUser);
            if (isExists) {
                try {
                    const post = await PostService.getInstance().updateUserById(req.body.idUser, req.body.idPost, req.body.hourlyWage, req.body.description);
                    res.json({
                        response : true
                    });
                } catch (err) {
                    console.log(err);
                    res.status(400).json(err);
                }

            } else {
                console.log("This post id doesn't exists")
                res.sendStatus(404).end();
            }
        }
    }

    async searchPost(req: Request, res: Response) {
        if (req.user !== undefined) {
            const role = await AuthService.getInstance().getRoleByUserId(req.user.id);
            try {
                const post = await PostService.getInstance().searchPost({
                    activityZone: req.body.activityZone,
                    availability: req.body.availability,
                    skill: req.body.skill,
                    category: req.body.category,
                    role: role[0].role
                });
                res.json({
                    response: post
                });
            } catch (err) {
                console.log(err);
                res.status(400).json(err);
            }
        }
    }

    async createPost(req: Request, res: Response) {
        try {
            if (req.user !== undefined) {
                const role = await AuthService.getInstance().getRoleByUserId(req.user.id);
                if (role[0].role === "parent") {
                    const post = await PostService.getInstance().createParentPost({
                        idUser: req.user.id,
                        cityCode: req.body.cityCode,
                        hourlyWage: req.body.hourlyWage,
                        description: req.body.description,
                        ageChild: req.body.ageChild,
                        numberChild: req.body.numberChild
                    });
                    const created = await PostService.getInstance().getLastByUserId(req.user.id);
                    // création des disponibilités pour le post parent
                    await AvailabilityService.getInstance().add(req.body.availability, req.user.id, created[0].id);
                    res.send({
                        response: post
                    });
                    let idPost: number = created[0].id;
                    //creation skill pour le post parent
                    if (req.body.listSkill) {

                        await SkillService.getInstance().addSkillPost({
                            idPost: idPost,
                            name: req.body.listSkill
                        });

                        res.send({
                            response: post
                        });
                    }
                }
                if (role[0].role === "babysitter") {
                    if (req.body.codeDep.length > 0) {
                        const post = await PostService.getInstance().createBabyTeacherPost({
                            idUser: req.user.id,
                            hourlyWage: req.body.hourlyWage,
                            description: req.body.description,
                        });
                        const created = await PostService.getInstance().getLastByUserId(req.user.id);
                        await ActivtyZoneService.getInstance().createActivityZone(created[0].id, req.body.codeDep);
                        res.send({
                            response: post
                        });
                    } else {
                        throw new Error("Activity zone is required");
                    }
                } else {
                    throw new Error("You are not a parent or a babysitter");
                }
            }
        } catch (err) {
            console.log(err);
            res.status(400).json(err);
        }
    }


    buildRoutes(): Router {
        const router = express.Router();
        router.post('/add', checkUserConnected(), express.json(), this.createPost.bind(this));
        router.post('/update/:id', express.json(), checkUserConnected(), this.updatePost.bind(this));
        router.post('/updatePostUser', express.json(), checkUserConnected(), this.updatePostUser.bind(this));
        router.post('/search-post', express.json(), checkUserConnected(), this.searchPost.bind(this));
        router.get('/get/:id', checkUserConnected(), this.show.bind(this));
        router.get('/getByUserId/:id', checkUserConnected(), this.getByUserId.bind(this));
        router.get('/all', checkUserConnected(), this.all.bind(this));
        router.delete('/delete/:id', checkUserConnected(), this.deletePost.bind(this));
        return router;
    }
}