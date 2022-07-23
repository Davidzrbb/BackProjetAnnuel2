import mongoose, {Schema, Document, Model} from "mongoose";


const messageSchema = new Schema({
    idUser1: {
        type: Schema.Types.Number,
        required: true
    },
    idUser2: {
        type: Schema.Types.Number,
        required: true
    },
    messageList: [{
        valueMessage: {
            type: String,
        },
        idUser: {
            type: Number,
        },
        date: {
            type: Date,
        }
    }]
}, {
    collection: "messages",
    timestamps: true,
    versionKey: false
});

export interface MessageProps extends Document {
    idUser1: number;
    idUser2: number;
    messageList: [{
        valueMessage: string;
        idUser: string;
        date: Date;
    }];
}

export type OrderDocument = MessageProps & Document;
export const MessageModel: Model<OrderDocument> = mongoose.model<OrderDocument>("Message", messageSchema);
