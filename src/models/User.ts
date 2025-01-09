import mongoose , {Schema,Document} from "mongoose";
import { unique } from "next/dist/build/utils";

export  interface  Message extends Document{
    content: string;
    createdAt: Date;
}

const MessageSchema:Schema<Message> = new Schema({
    content: {type: String, required: true},
    createdAt: {type: Date, default: Date.now}
})


export interface User extends Document{
    username:string,
    email:string,
    password:string,
    verifyCode:string,
    isVerified:boolean,
    isAcceptingMassage:boolean,
    messages: Message[]


}

const UserSchema:Schema<User> = new Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required:[ true,'Email is required'],match:[/.+\@.+\..+/,'please use a valid email address'], unique: true},
    password: {type: String, required:[ true, "Password is required"]},
    verifyCode: {type: String ,required:[true,"verify code is required"]},
    isVerified:{type:Boolean,default:false},
    isAcceptingMassage: {type: Boolean, default: true},
    messages: [MessageSchema],
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User",UserSchema)
export default UserModel;