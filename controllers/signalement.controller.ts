import express, {Request, Response} from "express";
import {SignalementService} from "../services";
import {checkUserConnected} from "../middlewares";

export class SignalementController{

    async getAll(req: Request, res: Response) {
        try {
            const signalements = await SignalementService.getInstance().getAll();
            res.send({
                response: signalements
            });
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async getById(req: Request, res: Response) {
        let signalement;
        try {
            if (req.query.id) {
                signalement = await SignalementService.getInstance().getById(parseInt(<string>req.params.id));
            }
            if (signalement) {
                res.send({
                    response: signalement
                });
            } else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async getSignalementByProfile(req: Request, res: Response) {
        try {
            const signalements = await SignalementService.getInstance().getByProfileId(parseInt(<string>req.params.idProfile));
            if (signalements) {
                res.send({
                    response: signalements
                });
            } else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async getSignalementBySignaler(req: Request, res: Response) {
        try {
            const signalements = await SignalementService.getInstance().getBySignalerId(parseInt(<string>req.params.idSignaler));
            if (signalements) {
                res.send({
                    response: signalements
                });
            } else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async createSignalement(req: Request, res: Response) {
        try {
            const signalement = await SignalementService.getInstance().add({
                idProfile: req.body.idProfile,
                idSignaler: req.body.idSignaler,
                dateTime: req.body.dateTime,
                reason: req.body.reason
            });
            if (signalement) {
                res.send({
                    response: signalement
                });
            } else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async updateSignalement(req: Request, res: Response) {
        try {
            const signalement = await SignalementService.getInstance().update({
                id: parseInt(<string>req.params.id),
                idProfile: req.body.idProfile,
                idSignaler: req.body.idSignaler,
                dateTime: req.body.dateTime,
                reason: req.body.reason
            });
            if (signalement) {
                res.send({
                    response: signalement
                });
            } else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async deleteSignalement(req: Request, res: Response) {
        try {
            const signalement = await SignalementService.getInstance().delete(parseInt(<string>req.params.id));
            if (signalement) {
                res.send({
                    response: signalement
                });
            } else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    buildRoutes() {
        const router = express.Router();
        router.get('/all', checkUserConnected(), this.getAll.bind(this));
        router.get('/:id', checkUserConnected(), this.getById.bind(this));
        router.get('/getByProfile/:idProfile', checkUserConnected(), this.getSignalementByProfile.bind(this));
        router.get('/getBySignaler/:idSignaler', checkUserConnected(), this.getSignalementBySignaler.bind(this));
        router.post('/create', express.json(), checkUserConnected(), this.createSignalement.bind(this));
        router.put('/edit/:id', express.json(), checkUserConnected(), this.updateSignalement.bind(this));
        router.delete('/delete/:id', checkUserConnected(), this.deleteSignalement.bind(this));
        return router;
    }

}