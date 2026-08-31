import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes";
import groupsRoutes from "./routes/groupRoutes";
import userRoutes from "./routes/userRoutes";
import {authenticateConection} from "./config/db";
import { corsOptions } from "./config/cors";

const app = express();

//Validamos la coneccion a la base de datos
authenticateConection();

//Habilitamos el envio de peticiones HTTP para los dominios permitidos
app.use( cors( corsOptions ) );

//Habilitamos los logs.
app.use( morgan("dev") );

//Con esta linea habilitamos el poder enviar datos.
app.use( express.json() );

app.use("/api/auth", authRoutes);
app.use("/api/groups", groupsRoutes);
app.use("/api/users", userRoutes);

export default app;