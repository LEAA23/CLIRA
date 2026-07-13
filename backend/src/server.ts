import express from "express";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes";

const app = express();

//Habilitamos los logs.
app.use( morgan("dev") );

//Con esta linea habilitamos el poder enviar datos.
app.use( express.json() );

app.use("/api/auth", authRoutes);

export default app;