import { Types } from "mongoose";
export interface IComment {
    userId: Types.ObjectId;
    projectId: Types.ObjectId;
    text: string;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=comment.interface.model.d.ts.map