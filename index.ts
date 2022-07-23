import {config} from "dotenv";

config();

import express from "express";

import {
    AuthController,
    CategorieController,
    TestController,
    PostController,
    MessageController,
    RoleController,
    SessionController,
    SignalementController,
    AvailabilityController,
    CommentController,
    ContractController,
    AdminController,
    ActivityZoneController, StatsController
} from "./controllers";

import {db} from "./utils/mysql.connector";
import mongoose, {Mongoose} from "mongoose";
import http from "http";
import {MessageService} from "./services";

async function startServer(): Promise<void> {
    // ---> connexion à MonGo BD
    try {
        const m: Mongoose = await mongoose.connect(process.env.MONGO_URI as string, {
            auth: {
                username: process.env.MONGO_USER as string,
                password: process.env.MONGO_PASSWORD as string
            }
        });
    } catch (e) {
        console.log(e)
    }

    db.connect();


    const port = process.env.PORT || 3000;
    const app = express();
    const httpServer = http.createServer(app);
    const io = require('socket.io')(httpServer, {
        cors: {origin: process.env.FRONT_URL}
    });
    let cors = require('cors');
    // use it before all route definitions
    app.use(cors({origin: process.env.FRONT_URL}));

    // ---> Déclaration est appels aux controllers
    const authController = new AuthController();
    app.use('/auth', authController.buildRoutes());

    const categorieController = new CategorieController();
    app.use('/categorie', categorieController.buildRoutes());

    const testController = new TestController();
    app.use('/test', testController.buildRoutes());

    const postController = new PostController();
    app.use('/post', postController.buildRoutes());

    const availabilityController = new AvailabilityController();
    app.use('/availability', availabilityController.buildRoutes());

    const commentController = new CommentController();
    app.use('/comment', commentController.buildRoutes());

    const contractController = new ContractController();
    app.use('/contract', contractController.buildRoutes());

    const messageController = new MessageController();
    app.use('/message', messageController.buildRoutes());

    const roleController = new RoleController();
    app.use('/role', roleController.buildRoutes());

    const sessionController = new SessionController();
    app.use('/session', sessionController.buildRoutes());

    const signalementController = new SignalementController();
    app.use('/signalement', signalementController.buildRoutes());

    const adminController = new AdminController();
    app.use('/admin', adminController.buildRoutes());

    const activityZoneController = new ActivityZoneController();
    app.use('/activityZone', activityZoneController.buildRoutes());

    const statsController = new StatsController();
    app.use('/stats', statsController.buildRoutes());

    io.on('connection', (socket: any) => {
        socket.on('createRoom', async (data: any) => {
            socket.join(data.idSession);
        });
        socket.on('data', (data: any) => {
            io.sockets.in(data.userId).emit('eventToClient', {idUser: data.idUser, message: data.message});
        });
    });
    
    httpServer.listen(port, () => console.log(`Listening on port ${port}`));
}


startServer().catch(console.error);
