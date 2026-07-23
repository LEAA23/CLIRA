import { useNavigate, useParams } from "react-router-dom";
import type { UserValidateToken } from "../../types";
import { useAppStore } from "../../stores/useAppStore";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import ResetPasswordForm from "../../components/auth/ResetPasswordForm";

const NewPasswordView = () => {
    //Extraemos la funcip de nuestro appStore para evaluar si el token es valido para cambiar el password
    const validateTokenAccount = useAppStore( (state) => state.validateTokenAccount ); 
    //UseNavigate nos permite redireccionar al usuario a una pagina en especifico
    const navigate = useNavigate();

    //Extraemos el token de la url mediante useParams()
    const { token } = useParams<{token : string}>();
    //Creamos un state local para validar si el token es valido
    const [isValidToken, setIsValidToken] = useState<boolean>(false);

    //Cada vez que el token cambie de valor se va a ejecutar esta funcion
    useEffect(() => {
        async function validateToken(token : UserValidateToken["token"]) {
            try {
                const message = await validateTokenAccount( token );
                //Cambiamos el valor del state local a true si el token es valido
                setIsValidToken(true);
                toast.success(message);
            } catch (error) {
                if( error instanceof Error ) {
                    //Redireccionamos al usuario al login si el token es invalido
                    toast.error(error.message);
                    setTimeout(() => {
                        navigate("/auth/login");
                    }, 5000);
                }
                
                throw error;
            }
        }
        validateToken(token!);
    }, [token]);


  return (
    <>
        {isValidToken? 
            ( <ResetPasswordForm token={token!}/> ): 
            (
                <>
                    <h1 className="text-4xl font-bold text-center my-20">
                        <span className="text-blue-500">Token No {""}</span>
                        Valido
                    </h1>
                        <p className="text-center my-10">Obten un nuevo token mandando una nueva peticion.</p>
                        <img src="/invalidToken.png" alt="Invalid token image" className="h-30 mx-auto mb-45"/>
                   
                </>
            )
        }
    </>
  )
}

export default NewPasswordView