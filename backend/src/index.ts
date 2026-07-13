import app from "./server";
import colors, { bold } from "colors";

const port = process.env.port || 4000;

//Desplegamos el servidor en el puerto que este disponible
app.listen(port, () => {
    console.log( colors.bold.bgCyan(`El servidor esta corriendo en el puerto ${port}`) )
});