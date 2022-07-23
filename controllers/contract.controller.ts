import express, {Request, Response, Router} from "express";
import {ContractService} from "../services";
import {checkUserConnected} from "../middlewares";

export class ContractController {

    async getAll(req: Request, res: Response) {
        try {
            const contracts = await ContractService.getInstance().getAll();
            res.send({
                response: contracts
            });
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async getById(req: Request, res: Response) {
        let contract;
        try {
            contract = await ContractService.getInstance().getById(parseInt(<string>req.params.id), req.user?.id);
            if (contract) {
                res.send({
                    response: contract[0]
                });
            } else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async getContractByParentId(req: Request, res: Response) {
        try {
            const contracts = await ContractService.getInstance().getByParent(parseInt(<string>req.params.idParent));
            res.send({
                response: contracts
            });
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async getContractByBabysitterId(req: Request, res: Response) {
        try {
            const contracts = await ContractService.getInstance().getByBabysitter(parseInt(<string>req.params.idBabysitter));
            res.send({
                response: contracts
            });
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async createContract(req: Request, res: Response) {
        try {
            const contract = await ContractService.getInstance().add({
                idParent: req.body.idParent,
                idBabysitter: req.body.idBabysitter,
                validateAt: req.body.validateAt,
                numberOfHours: req.body.numberOfHours,
                hourlyWage: req.body.hourlyWage,
                numberOfSitting: req.body.numberOfSitting,
                numberOfHoursDone: req.body.numberOfHourDone,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                step: req.body.step
            });
            if (contract) {
                res.send({
                    response: true
                });
            } else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async updateContract(req: Request, res: Response) {
        try {
            const contract = await ContractService.getInstance().update({
                id: parseInt(<string>req.params.id),
                idParent: req.body.idParent,
                idBabysitter: req.body.idBabysitter,
                validateAt: req.body.validateAt,
                numberOfHours: req.body.numberOfHours,
                hourlyWage: req.body.hourlyWage,
                numberOfSitting: req.body.numberOfSitting,
                numberOfHoursDone: req.body.numberOfHoursDone,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                step: req.body.step
            });
            if (contract) {
                res.send({
                    response: contract
                });
            } else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async deleteContract(req: Request, res: Response) {
        try {
            const contract = await ContractService.getInstance().delete(parseInt(<string>req.params.id));
            if (contract) {
                res.send({
                    response: contract
                });
            } else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    //update contract step
    async updateHoursDone(req: Request, res: Response) {
        try {
            const contract = await ContractService.getInstance().updateHoursDone(parseInt(req.body.id), req.body.hours);
            if (contract) {
                res.send({
                    response: contract
                });
            } else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    //update hours done
    async updateContractStep(req: Request, res: Response) {
        try {
            const contract = await ContractService.getInstance().updateStep(parseInt(req.body.id), req.body.step);
            if (contract) {
                res.send({
                    response: contract
                });
            } else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async stripe(req: Request, res: Response) {
        const stripe = require('stripe')('sk_test_51LJduaAGkSy9SO1ICDek5Ky1csMtQxWn76bhQm8bHSAO6CkCUQ9jGwzt2JIx0MaDvdxsnEfuA2xtOE8QtF2PFKSw00RB93uctu');
        try {
            let token = req.body

            const customer = stripe.customers
                .create({
                    email: token.email,
                    source: token.id
                })
                .then((customer: any) => {
                    return stripe.charges.create({
                        amount: token.amount,
                        description: "Test Purchase using express and Node",
                        currency: "USD",
                        customer: customer.id,
                    });
                })
                .then((charge: any) => {
                    res.json({
                        data: "success"
                    })
                })
                .catch((err: any) => {
                    res.json({
                        data: "failure",
                    });
                });
            return true;
        } catch (error) {
            return false;
        }
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.get('/all', checkUserConnected(), this.getAll.bind(this));
        router.get('/getById/:id', checkUserConnected(), this.getById.bind(this));
        router.get('/getByParent/:idParent', checkUserConnected(), this.getContractByParentId.bind(this));
        router.get('/getByBabysitter/:idBabysitter', checkUserConnected(), this.getContractByBabysitterId.bind(this));
        router.post('/create', express.json(), checkUserConnected(), this.createContract.bind(this));
        router.put('/update', express.json(), checkUserConnected(), this.updateContract.bind(this));
        router.put('/updateContractStep', express.json(), checkUserConnected(), this.updateContractStep.bind(this));
        router.put('/updateHoursDone', express.json(), this.updateHoursDone.bind(this));
        router.delete('/delete', checkUserConnected(), this.deleteContract.bind(this));
        router.post('/stripe', express.json(), this.stripe.bind(this));
        return router;
    }
}