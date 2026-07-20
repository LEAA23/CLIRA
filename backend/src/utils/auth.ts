import bcrypt from "bcrypt";
import { User } from "../models/User";

export const hashPassword = async ( password : string ) => {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    return hashPassword;
}

export const checkPassword = async ( password : string, hashPassword: string ) => await bcrypt.compare( password, hashPassword );

export const cleanTokenFields = async ( user : User ) => {
    user.token = null;
    user.tokenExpiresAt = null
    await user.save();
}

export const confirmUser= async ( user : User ) => {
    user.token = null;
    user.tokenExpiresAt = null;
    user.confirm = true;
    await user.save();
}

export const saveNewPassword = async ( user : User, password: string ) => {
    user.password = await hashPassword( password );
    user.token = null;
    user.tokenExpiresAt = null;
    await user.save();
}