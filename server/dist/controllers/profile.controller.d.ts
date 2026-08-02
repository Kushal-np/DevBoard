import { Request, Response, RequestHandler } from "express";
type UserParams = {
    username: string;
};
export declare const getUserProfile: RequestHandler<UserParams>;
export declare const editProfile: (req: Request, res: Response) => Promise<void>;
export declare const changePassword: (req: Request, res: Response) => Promise<void>;
export declare const deleteAccount: (req: Request, res: Response) => Promise<void>;
export {};
//# sourceMappingURL=profile.controller.d.ts.map