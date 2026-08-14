import axios from "axios";

//Mediante .create() creamos un cliente de axios con una URL base para no tener que estarla especificanso a cada rato en las llamadas
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

/**
 * Mediante interceptors podemos podemos mandar informacion antes o despues de hacer la peticion HTTP, en este caso utilizamos 
 * request ya que vamos a mandar algo antes de hacer la peticion y accedemos a .use(), donde obtenemos config y accedemos a 
 * Authorization escribimos el token, esto con la finalidad de no tener que estar escribiendo los headers en cada llamado.
 */
api.interceptors.request.use( config => {
    const token = localStorage.getItem("AUTH_TOKEN");

    config.headers.Authorization = `Bearer ${token}`
    return config;
} )

export default api;