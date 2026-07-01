import {Types} from "mongoose";
import { NotificationType } from "../../models/notification.model";

export interface INotification{
    recipientId: Types.ObjectId ; 
    actorId: Types.ObjectId;
    type: NotificationType; 
    refId?: Types.ObjectId;
    read:boolean ; 
    createdAt:Date ; 
    updatedAt:Date ; 
}