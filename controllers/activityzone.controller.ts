import express, {Request, Response, Router} from "express";
import {checkUserConnected} from "../middlewares";
import {ActivtyZoneService, AuthService} from "../services";

export class ActivityZoneController {

    async deleteActivity(req: Request, res: Response) {
        const isExist = await ActivtyZoneService.getInstance().getById(parseInt(req.params.id));
        if (isExist.length !== 0) {
            try {
                const post = await ActivtyZoneService.getInstance().deleteById(parseInt(req.params.id));
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
        const isExist = await ActivtyZoneService.getInstance().getById(parseInt(req.params.id));
        if (isExist.length !== 0) {
            try {
                const post = await ActivtyZoneService.getInstance().getById(parseInt(req.params.id));
                res.json(post);
            } catch (err) {
                console.log(err);
                res.status(400).json(err);
            }
        } else {
            console.log("This post id doesn't exists")
            res.status(404).end();
        }
    }
    async getByIdPost(req: Request, res: Response) {
        const isExist = await ActivtyZoneService.getInstance().getByPostId(parseInt(req.params.id));
        if (isExist.length !== 0) {
            try {
                res.json({
                    response : isExist
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
    async updateActivity(req: Request, res: Response) {
        if (req.user !== undefined) {
            const isExists = await ActivtyZoneService.getInstance().getById(parseInt(req.params.id));
            const role = await AuthService.getInstance().getRoleByUserId(req.user.id);
            if (isExists) {
                try {
                    const post = await ActivtyZoneService.getInstance().updateActivityZoneById(parseInt(req.params.id), req.body);
                    res.json(post);
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

    async createActivity(req: Request, res: Response) {
        try {
            const activity = await ActivtyZoneService.getInstance().createActivityZone(req.body.idPost, req.body.codeDep);
            res.json(activity);
        } catch (err) {
            console.log(err);
            res.status(400).json(err);
        }
    }


    buildRoutes(): Router {
        const router = express.Router();
        router.post('/add', checkUserConnected(), express.json(), this.createActivity.bind(this));
        router.post('/update/:id', express.json(), checkUserConnected(), this.updateActivity.bind(this));
        router.get('/get/:id', checkUserConnected(), this.show.bind(this));
        router.get('/getByIdPost/:id', checkUserConnected(), this.getByIdPost.bind(this));
        router.delete('/delete/:id', checkUserConnected(), this.deleteActivity.bind(this));
        return router;
    }
}
