import { model, Schema } from "mongoose";

import { IRole } from "./role.interface";
import { Collection } from "../../utils/modelConstants";

const roleSchema = new Schema<IRole>(
    {
        roleName: {
            type: String,
            required: [true, "Role name is required"],
            trim: true,
            unique: true,
        },

        permissions: {
            type: [String],
            required: [true, "Permissions are required"],
            default: [],
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export const Role = model<IRole>(
    Collection.Role,
    roleSchema
);