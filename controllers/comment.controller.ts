import express, {Request, Response, Router} from "express";
import {CommentService} from "../services";
import {checkUserConnected} from "../middlewares";


export class CommentController {

    async getAll(req: Request, res: Response) {
        try {
            const comments = await CommentService.getInstance().getAll();
            res.send({
                response: comments
            });
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async getById(req: Request, res: Response) {
        let comment;
        try {
            if (req.query.id) {
                comment = await CommentService.getInstance().getById(parseInt(<string>req.params.id));
            }
            if (comment) {
                res.send({
                    response: comment
                });
            }else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async getByUserComment(req: Request, res: Response) {
        try {
            const comments = await CommentService.getInstance().getByUserComment(parseInt(<string>req.params.idUserComment));
            res.send({
                response: comments
            });
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async createComment(req: Request, res: Response) {
        try {
            const comment = await CommentService.getInstance().add({
                idProfile: req.body.idProfile,
                idUserComment:  req.user?.id,
                date: req.body.date,
                content: req.body.content,
                note: req.body.note
            });
            if (comment) {
                res.send({
                    response: true
                });
            }else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async getCommentByProfile(req: Request, res: Response) {
        try {
            const comments = await CommentService.getInstance().getByProfile(parseInt(<string>req.params.idProfile));
            res.send({
                response: comments
            });
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async updateComment(req: Request, res: Response) {
        try {
            const comment = await CommentService.getInstance().update({
                id: parseInt(<string>req.params.id),
                idProfile: req.body.idProfile,
                idUserComment: req.body.idUserComment,
                date: req.body.date,
                content: req.body.content,
                note: req.body.note
            });
            if (comment) {
                res.send({
                    response: comment
                });
            }else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async deleteComment(req: Request, res: Response) {
        try {
            const comment = await CommentService.getInstance().delete(parseInt(<string>req.params.id));
            if (comment) {
                res.send({
                    response: comment
                });
            }else {
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
        router.get('/:id', checkUserConnected(), this.getById.bind(this));
        router.get('/getByUser/:idUserComment', checkUserConnected(), this.getByUserComment.bind(this));
        router.get('/getByProfile/:idProfile', checkUserConnected(), this.getCommentByProfile.bind(this));
        router.post('/create', express.json(), checkUserConnected(), this.createComment.bind(this));
        router.put('/update/:id', express.json(), checkUserConnected(), this.updateComment.bind(this));
        router.delete('/delete/:id', checkUserConnected(), this.deleteComment.bind(this));
        return router;
    }

}