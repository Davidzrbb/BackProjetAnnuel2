import {StatsService} from "../services/stats.service";
import express, {Request, Response} from "express";
import {checkUserConnected} from "../middlewares";

export class StatsController {

    public async getUserCount(req: Request, res: Response) {
        try {
            const count = await StatsService.getInstance().getUserCount();
            if (count) {
                let result = count[0]["COUNT(*)"]
                res.send({
                    result
                });
            }else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(400).end(); // bad request
        }
    }

    public async getAllContratCount(req: Request, res: Response) {
        try {
            const contrats = await StatsService.getInstance().getCountAllContrat();
            if (contrats) {
                let result = contrats[0]["COUNT(*)"]
                res.send({
                    result
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
        router.get('/userCount', this.getUserCount.bind(this));
        router.get('/contratCreatedCount', this.getAllContratCount.bind(this));
        return router;
    }
}