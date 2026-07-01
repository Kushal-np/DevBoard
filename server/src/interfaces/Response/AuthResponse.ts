import { IUserResponse } from ".";

export interface IAuthResponse{
    success:boolean;
    user:IUserResponse ; 
    message:string;
}