import express, {Request, Response, Router} from "express";
import {TestService} from "../services/test.service";
import {RowDataPacket} from "mysql2";

export class TestController {
    async getAllTest(req: Request, res: Response) {
        const platform = req.headers['user-agent'] || "Unknown";

        try {
            const test: RowDataPacket[] = await TestService.getInstance().getAllTest();
            res.json(test);
        }catch (err) {
            res.status(400).end();
        }

    }

    async addTest(req: Request, res: Response) {
        const platform = req.headers['user-agent'] || "Unknown";
        try {
            console.log(req.body);
            const test = await TestService.getInstance().addTest({
                name: req.body.name,
                lastname: req.body.lastname
            });
            if(test){
                res.status(201).json(test);
            }else {
                res.status(400).end();
            }
        }catch (err) {
            res.status(400).end();
        }
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.get('/allTest', this.getAllTest.bind(this));
        router.post('/addTest', express.json(), this.addTest.bind(this));
        return router;
    }
}