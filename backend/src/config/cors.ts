import type { CorsOptions } from "cors";

//Los dominios que estan permitidos para mandar peticiones HTTP al backend
const allowedDomains = [process.env.FRONTEND_URL];

export const corsOptions : CorsOptions = {
    origin: function( origin, callback) {

        //Si el dominio existe en los dominios permitidos le permitimos al dominio el envio de peticiones HTTP
        if( allowedDomains.indexOf(origin) !== -1 ) {
            callback(null, true);
        } else {
            //Si no mandamos un error de CORS
            callback( new Error("No permitido por CORS") );
        }
    }
}