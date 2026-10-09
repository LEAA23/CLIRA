import type Experience from "../PatientExperience/Experience";

//Modificamos la variable global de Window y le agregamos el atributo de experience el cual va a tener la instancia de nuestra clase Experience, para poder tener acceso global
declare global {
    interface Window {
        experience: Experience;
    }
}