import { Request, Response } from "express";
export declare const register: (req: Request, res: Response) => Promise<void>;
export declare const login: (req: Request, res: Response) => Promise<void>;
export declare const logout: (req: Request, res: Response) => Promise<void>;
export declare const getMe: (req: Request, res: Response) => Promise<void>;
export declare const followUser: (req: Request, res: Response) => Promise<void>;
export declare const unfollowUser: (req: Request, res: Response) => Promise<void>;
export declare const getFollowData: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getRecommendations: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=user.controller.d.ts.map