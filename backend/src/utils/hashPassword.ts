import bcrypt, { hash } from "bcrypt";

export const hashPassword = async ( password : string ) => {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    return hashPassword;
}