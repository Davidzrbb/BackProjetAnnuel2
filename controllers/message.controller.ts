import express, {Request, Response, Router} from "express";
import {MessageService} from "../services";
import {checkUserConnected} from "../middlewares";

export class MessageController {
    async createMessage(req: Request, res: Response) {
        try {
            await MessageService.getInstance().createMessage({
                idUser1: req.body.idUser1,
                idUser2: req.body.idUser2
            });
            res.status(201).json(true);
        } catch (err) {
            console.log(err)
            res.status(400).end();
        }
    }

    async saveMessage(req: Request, res: Response) {
        try {
            await MessageService.getInstance().saveMessage(req.body?.messageValue, req.body?.userId1, req.body?.userId2, req.body?.userId, req.body?.date);
            res.json(true);
        } catch (err) {
            console.log(err)
            res.status(400).end();
        }
    }

    async getMessage(req: Request, res: Response) {
        try {
            const messages = await MessageService.getInstance().getMessage(req.params['id1'], req.params['id2']);
            res.json(messages);
        } catch (err) {
            console.log(err)
            res.status(400).end();
        }
    }

    async getAllMessagesByIdUser(req: Request, res: Response) {
        try {
            const messages = await MessageService.getInstance().getAllMessagesByIdUser(req.params['id1']);
            res.json(messages);
        } catch (err) {
            console.log(err)
            res.status(400).end();
        }
    }

    async isMessageExist(req: Request, res: Response) {
        try {
            const messages = await MessageService.getInstance().isMessageExist(req.params['id1'], req.params['id2']);
            if (messages) {
                res.json(messages._id);
            } else {
                res.json(false);
            }
        } catch (err) {
            console.log(err)
            res.status(400).end();
        }
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.post('/save-message', express.json(), checkUserConnected(), this.saveMessage.bind(this));
        router.post('/create-session-message', express.json(), checkUserConnected(), this.createMessage.bind(this));
        router.get('/get-message/:id1/:id2', express.json(), checkUserConnected(), this.getMessage.bind(this));
        router.get('/get-all-messages-by-id/:id1', express.json(), checkUserConnected(), this.getAllMessagesByIdUser.bind(this));
        router.get('/is-message-exist/:id1/:id2', express.json(), checkUserConnected(), this.isMessageExist.bind(this));
        return router;
    }
}