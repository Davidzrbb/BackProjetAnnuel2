import express, {Request, Response} from "express";
import {SessionService} from "../services";
import {checkUserConnected} from "../middlewares";

export class SessionController {
    async getAll(req: Request, res: Response) {
        try {
            const sessions = await SessionService.getInstance().getAll();
            res.send({
                response: sessions
            });
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async getById(req: Request, res: Response) {
        let session;
        try {
            if (req.query.id) {
                session = await SessionService.getInstance().getById(parseInt(<string>req.params.id));
            }
            if (session) {
                res.send({
                    response: session
                });
            } else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async getByUser(req: Request, res: Response) {
        try {
            const session = await SessionService.getInstance().getByUserId(parseInt(<string>req.params.idUser));
            if (session) {
                res.send({
                    response: session
                });
            } else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async getByToken(req: Request, res: Response) {
        try {
            const session = await SessionService.getInstance().getByToken(req.params.token);
            if (session) {
                res.send({
                    response: session
                });
            } else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async createSession(req: Request, res: Response) {
        try {
            const session = await SessionService.getInstance().add({
                expirationDate: req.body.expirationDate,
                createdAt: req.body.createdAt,
                id_user: req.body.id_user,
                token: req.body.token
            });
            if (session) {
                res.send({
                    response: session
                });
            } else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async updateSession(req: Request, res: Response) {
        try {
            const session = await SessionService.getInstance().update({
                id: parseInt(<string>req.params.id),
                expirationDate: req.body.expirationDate,
                createdAt: req.body.createdAt,
                id_user: req.body.id_user,
                token: req.body.token
            });
            if (session) {
                res.send({
                    response: session
                });
            } else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async deleteSession(req: Request, res: Response) {
        try {
            const session = await SessionService.getInstance().delete(parseInt(<string>req.params.id));
            if (session) {
                res.send({
                    response: session
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
        router.get('/getByUser/:idUser', checkUserConnected(), this.getByUser.bind(this));
        router.get('/getByToken/:token', checkUserConnected(), this.getByToken.bind(this));
        router.post('/create', express.json(), checkUserConnected(), this.createSession.bind(this));
        router.put('/edit/:id', express.json(), checkUserConnected(), this.updateSession.bind(this));
        router.delete('/delete/:id', checkUserConnected(), this.deleteSession.bind(this));
        return router;
    }

}
