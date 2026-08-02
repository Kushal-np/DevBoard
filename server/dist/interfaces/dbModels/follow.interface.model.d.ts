import { Types } from "mongoose";
export interface IFollow {
    followerId: Types.ObjectId;
    followingId: Types.ObjectId;
    createdAt: Date;
    udpatedAt: Date;
}
//# sourceMappingURL=follow.interface.model.d.ts.map