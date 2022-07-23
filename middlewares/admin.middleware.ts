import {Request, RequestHandler} from "express";
import {AuthService} from "../services/auth.service";
import {RowDataPacket} from "mysql2";

declare module 'express' {
    export interface Request {
        user?: RowDataPacket;
        //user?: UserProps;
    }
}

export function checkAdminConnected(): RequestHandler {

    return async function (req: Request,
                           res,
                           next) {
        const authorization = req.headers['authorization'];
        if (authorization === undefined) {
            res.status(401).end();
            return;
        }
        const parts = authorization.split(" ");
        if (parts.length !== 2) {
            res.status(401).end();
            return;
        }
        if (parts[0] !== 'Bearer') {
            res.status(401).end();
            return;
        }
        const token = parts[1];
        try {
            const userId = await AuthService.getInstance().getUserByToken(token);
            if (userId === null) {
                res.status(401).end();
                return;
            }
            const user = await AuthService.getInstance().getUserById(userId[0].id_user);
            req.user = user[0];
            const role = await AuthService.getInstance().getRoleByUserId(user[0].id);

            if (role[0].role !== 'admin') {
                res.status(401).end();
                return;
            }
            next();
        } catch (err) {
            res.status(401).end();
        }
    }
}