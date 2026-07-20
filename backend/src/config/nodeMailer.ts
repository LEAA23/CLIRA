import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

//Establecemos la cnfiguracion basica para el envio de emails mediante mailtrap
const config = () => {
    return {
        host: process.env.SMTP_HOST,
        port: +process.env.SMTP_PORT!,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
        }
    }
}

//Exportamos y creamos el transporter con la configuracion que hemos establecido y que nos va a permitir enviar emails
export const transporter = nodemailer.createTransport(config());