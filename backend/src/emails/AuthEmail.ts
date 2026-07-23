import { transporter } from "../config/nodeMailer";



interface IEmail {
    email: string;
    name: string;
    token: string;
}

//Creamos una clase que contenga todos los metodos para mandar los diferentes tipos de emails segun se requieran
export class AuthEmail {

    //Metodo que envia email al usuario cuando se registra.
    static sendConfirmationEmail = async( { email, name, token } : IEmail ) => {
        await transporter.sendMail({
            from: "clira@clira.com",
            to: email,
            subject: "Confirma tu cuenta en CLIRA",
            text: "Confirma tu cuenta en CLIRA",
            html: `
                <p>Hola ${name}, has creado tu cuenta en CLIRA, ya casi esta todo listo</p>
                <p>Visita el siguiente enlace:</p>
                <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirmar Cuenta</a>
                <p>E ingresa el siguiente token para confirmar tu cuenta: <b>${token}</b> </p>
                <p>El token expira en 10 minutos.</p>
            `
        });
    }

    static sendResetPasswordEmail = async( { email, name, token } : IEmail ) => {
        await transporter.sendMail({
            from: "clira@clira.com",
            to: email,
            subject: "Reestablece tu Contraseña de CLIRA",
            text: "Reestablece tu contraseña y recupera tu acceso a CLIRA",
            html: `
                <p>Hola ${name}, has mandado una solicitud para reestablecer tu acceso a CLIRA</p>
                <p>Visita el siguiente enlace:</p>
                <a href="${process.env.FRONTEND_URL}/auth/new-password/${token}">Reestablecer Contraseña</a>
            `
        });
    }
}