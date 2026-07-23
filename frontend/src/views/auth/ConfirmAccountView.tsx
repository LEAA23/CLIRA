import { PinInput, PinInputField } from "@chakra-ui/pin-input";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import type { ConfirmToken } from "../../types";
import { useAppStore } from "../../stores/useAppStore";

const ConfirmAccountView = () => {
  //Nos permite redireccionar al usuario
  const navigate = useNavigate();
  //Extraemos la funcion de neustro store que nos va a permitir confirmar al usuario
  const confirmAccount = useAppStore( (state) => state.confirmAccount );

  //Creamos un state local para poder leer el token que escriba el usuario
  const [token, setToken] = useState<ConfirmToken["token"]>("");

  //Cada cambio que haga el usuario en los PinInputField escribira esos cambios en el state de token
  const handleChange = ( tokenValue : ConfirmToken["token"] ) => {
    setToken(tokenValue);
  }

  //Una vez completado todos los campos hacemos uso de la funcion para confirmar al usuario
  const handleComplete = async( tokenFinalValue : ConfirmToken["token"] ) => {
    try {
      const message = await confirmAccount(tokenFinalValue);
      toast.success(message);
      setTimeout(() => {
        navigate("/auth/login");
      }, 5000);
      
    } catch (error) {
      if( error instanceof Error ) {
        toast.error(error.message);
      }
    }
  }

  return (
    <>
      <h1 className="text-center font-bold text-4xl mt-25">
          <span className="text-blue-500">Ingresa tu Token {""}</span>
          Para Confirmar tu Cuenta
      </h1>

      <form
        className="space-y-8 p-10 mt-10 mb-27 bg-white rounded-2xl max-w-5xl mx-auto shadow"
      >
        
        <legend className="text-2xl font-bold text-center">Token de 6 Dig&iacute;tos</legend>
        <div className="flex justify-center gap-5">
          <PinInput value={token} onChange={handleChange} onComplete={handleComplete}>
            <PinInputField className="w-15 h-15 border text-center border-gray-400 rounded-xl p-3 placeholder-white"/>
            <PinInputField className="w-15 h-15 border text-center border-gray-400 rounded-xl p-3 placeholder-white"/>
            <PinInputField className="w-15 h-15 border text-center border-gray-400 rounded-xl p-3 placeholder-white"/>
            <PinInputField className="w-15 h-15 border text-center border-gray-400 rounded-xl p-3 placeholder-white"/>
            <PinInputField className="w-15 h-15 border text-center border-gray-400 rounded-xl p-3 placeholder-white"/>
            <PinInputField className="w-15 h-15 border text-center border-gray-400 rounded-xl p-3 placeholder-white"/>
          </PinInput>

        </div>

        <div>
          <Link 
            to="/auth/request-token"
            className="flex justify-center text-blue-500 hover:text-blue-800"
          >Solicitar un nuevo token de confirmaci&oacute;n</Link>
        </div>
      </form>
    </>
  )
}

export default ConfirmAccountView;