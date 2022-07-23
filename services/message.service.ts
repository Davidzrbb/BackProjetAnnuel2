import {MessageModel, MessageProps} from "../models/message.model";


export class MessageService {

    private static instance?: MessageService;

    public static getInstance(): MessageService {
        if (MessageService.instance === undefined) {
            MessageService.instance = new MessageService();
        }
        return MessageService.instance;
    }

    private constructor() {
    }

    async saveMessage(messageValue: any, idUser1: number, idUser2: number, userId: number, date: Date) {
        const filter = {
            $or: [
                {
                    $and: [{idUser1: idUser1}, {idUser2: idUser2}]
                }, {
                    $and: [{idUser1: idUser2}, {idUser2: idUser1}]
                }]
        };
        const update = {$push: {messageList: {valueMessage: messageValue, idUser: userId, date: date}}};
        const newListMessage = await MessageModel.findOneAndUpdate(filter, update, {
            returnOriginal: false
        });
        if (newListMessage) {
            return newListMessage;
        } else {
            throw new Error('No data message');
        }
    }

    async getMessage(idUser1: string, idUser2: string) {
        const message = await MessageModel.findOne({
            $or: [
                {
                    $and: [{idUser1: idUser1}, {idUser2: idUser2}]
                }, {
                    $and: [{idUser1: idUser2}, {idUser2: idUser1}]
                }]
        });
        if (message) {
            return message;
        } else {
            return null
        }
    }

    async createMessage(message: Partial<MessageProps>) {
        if (message.idUser1 && message.idUser2) {
            const newMessage = new MessageModel(message);
            return await newMessage.save();
        } else {
            throw new Error('No data message');
        }
    }

    isMessageExist(idUser1: string, idUser2: string) {
        return MessageModel.findOne({
            $or: [
                {
                    $and: [{idUser1: idUser1}, {idUser2: idUser2}]
                }, {
                    $and: [{idUser1: idUser2}, {idUser2: idUser1}]
                }]
        });
    }

    async getAllMessagesByIdUser(id: string) {
        //getmessage by idUser1 ou userId2
        return MessageModel.find({
            $or: [{idUser1: id}, {idUser2: id}]
        });
    }

}