import jwt from "jsonwebtoken";

//Funcion para generar un jsonWebToken el cual nos permite transferir informacion de forma segura, esto nos va ayudar a
//momento de que el usuario inicie sesion podamos crear una sesion.
const generateJsonWebToken = (id : string) => {
    const dataExample = {
        id
    }

    //Recibe 3 argumentos, los datos a transferir, una llave privada y la fecha de expiracion del token
    const token = jwt.sign( dataExample, String(process.env.JWT_PRIVATEKEY) , { expiresIn: "6m" } );
    return token;
}

export default generateJsonWebToken;