import mongoose from "mongoose";
import { IProject } from "../interfaces/dbModels/project.interface.models";
declare const Project: mongoose.Model<IProject, {}, {}, {}, mongoose.Document<unknown, {}, IProject, {}, mongoose.DefaultSchemaOptions> & IProject & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, IProject>;
export default Project;
//# sourceMappingURL=project.model.d.ts.map