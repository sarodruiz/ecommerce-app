import { Schema, model, Document } from "mongoose";
import bcrypt from 'bcryptjs';

export interface User extends Document {
    name: string;
    email: string;
    password: string;
    createdAd: Date;
    updatedAt: Date;
}

const userSchema = new Schema<User>(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
            lowercase: true,
            match: [/\S+@\S+\.\S+/, 'Email is not valid']
        },
        password: {
            type: String,
            required: [true, "Password is required"]
        }
    },
    {
        timestamps: true
    }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error: any) {
        next(error);
    }
});

const User = model<User>("User", userSchema);

export default User;
