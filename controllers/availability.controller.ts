import express, {Request, Response, Router} from "express";
import {AvailabilityService} from "../services";
import {checkUserConnected} from "../middlewares";

export class AvailabilityController {

    async getAll(req: Request, res: Response) {
        try {
            const availabilities = await AvailabilityService.getInstance().getAll();
            res.send({
                response: availabilities
            });
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async getAvailabilityById(req: Request, res: Response) {
        try {
            const availability = await AvailabilityService.getInstance().getById(parseInt(<string>req.params.id));
            if (availability) {
                res.send({
                    response: availability
                });
            } else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async getAvailabilityByUserId(req: Request, res: Response) {
        try {
            const availabilities = await AvailabilityService.getInstance().getByUserId(parseInt(<string>req.params.idUser));
            res.send({
                response: availabilities
            });
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async getAvailabilityParseByUserId(req: Request, res: Response) {
        try {
            const availabilities = await AvailabilityService.getInstance().parseAvailability(parseInt(<string>req.params.idUser));
            res.send({
                response: availabilities
            });
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async getAvailabilityByPostId(req: Request, res: Response) {
        try {
            const availabilities = await AvailabilityService.getInstance().getByPostId(parseInt(<string>req.params.idPost));
            res.send({
                response: availabilities
            });
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async createAvailability(req: Request, res: Response) {
        try {
            if((!req.body.idUser && !req.body.idPost) || (req.body.idUser && req.body.idPost)){
                res.status(400).end();
            }
            let availability;
            if(req.body.idUser) {
                availability = await AvailabilityService.getInstance().add(req.body.arrayAvaibality, req.body.idUser, undefined);
            }else{
                availability = await AvailabilityService.getInstance().add(req.body.arrayAvaibality, undefined, req.body.idPost);
            }
            return res.json({
                response: true
            }) // Created
        } catch (err) {
            console.log(err)
            res.status(400).end(); // bad request
        }
    }

    async deleteAvailability(req: Request, res: Response) {
        try {
            const availability = await AvailabilityService.getInstance().delete(parseInt(<string>req.params.id));
            if (availability) {
                res.send({
                    response: availability
                });
            } else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.get('/all', checkUserConnected(), this.getAll.bind(this));
        router.get('/:id', checkUserConnected(), this.getAvailabilityById.bind(this));
        router.get('/getByUser/:idUser', checkUserConnected(), this.getAvailabilityByUserId.bind(this));
        router.get('/getByPost/:idPost', checkUserConnected(), this.getAvailabilityByPostId.bind(this));
        router.get('/getAvailabilityParseByUserId/:idUser', checkUserConnected(), this.getAvailabilityParseByUserId.bind(this));
        router.post('/create', express.json(), checkUserConnected(), this.createAvailability.bind(this));
        // router.put('/updateList', express.json(), checkUserConnected(), this.updateListAvailability.bind(this));
        router.delete('/delete/:id', checkUserConnected(), this.deleteAvailability.bind(this));
        return router;
    }

}