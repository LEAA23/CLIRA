import { Sequelize } from "sequelize";
import colors from "colors";
import dotenv from "dotenv"

//Habilitamos el uso de las variables de entorno
dotenv.config();

//Instanciamos Sequelize, lo cual nos permite establecer una conexion a una base de datos
const db = new Sequelize("clira", process.env.USER_DB!, process.env.PASSWORD_DB!, {
    host: process.env.HOST_DB!,
    port: +process.env.PORT_DB!,
    dialect: "postgres",
    define: {
        timestamps: true
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

//Verficamos que la conexion se haya realizado de forma correcta
export const authenticateConection = async() => {
    try {
        await db.authenticate();
        //Creamos las tablas en la base de datos si es que no existen
        await db.sync();
        console.log( colors.bgGreen("La conexion a la base de datos ha sido exitosa") );
    } catch (error) {
        console.log( colors.bgRed("Hubo un error al conectarse a la base de datos") );
        console.log(error)
    }
}

export default db;