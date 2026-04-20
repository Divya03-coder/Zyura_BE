import { Types } from "mongoose"

export type T_GroupMessage = {
    groupId:Types.ObjectId;
    senderId:Types.ObjectId;
    message:string;
    file? :{
        fileType:string;
        fileName:string;
        fileUrl:string;
    },
    likes?:Types.ObjectId[];
    reply?:string;
}
