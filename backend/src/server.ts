import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes";
import groupsRoutes from "./routes/groupRoutes";
import userRoutes from "./routes/userRoutes";
import caseRoutes from "./routes/caseRoutes";
import aiRoutes from "./routes/aiRoutes";
import {authenticateConection} from "./config/db";
import { corsOptions } from "./config/cors";
import { seedFilters, seedFilterCategories } from "./utils/filterSeeder";
import { seedLaboratoryStudies } from "./utils/seedLaboratoryStudies";
import { seedDiseases } from "./utils/seedDesieses";

const app = express();

//Validamos la coneccion a la base de datos
const startServer = async () => {
    await authenticateConection();

    await seedFilterCategories();
    await seedFilters();
    await seedLaboratoryStudies();
    await seedDiseases();

};
startServer();

//Habilitamos el envio de peticiones HTTP para los dominios permitidos
app.use( cors( corsOptions ) );

//Habilitamos los logs.
app.use( morgan("dev") );

//Con esta linea habilitamos el poder enviar datos.
app.use( express.json() );

app.use("/api/auth", authRoutes);
app.use("/api/groups", groupsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cases", caseRoutes);
app.use("/api/ai", aiRoutes);

export default app;