import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import ErrorMessage from "../../components/ErrorMessage";
import type { UserLoginForm } from "../../types";
import { useAppStore } from "../../stores/useAppStore";
import { toast } from "react-toastify";

const LoginView = () => {
  //Extraemos la funcion desde el authStore que le permite al usuario hacer el login
  const loginAccount = useAppStore( (state) => state.login );

  //Variable con los valores iniciales de los campos del formulario
  const initialValues : UserLoginForm = {
    email: "",
    password: ""
  }

  const { register, handleSubmit, formState: {errors} } = useForm<UserLoginForm>( { defaultValues: initialValues } );

  //Una vez que el usuario mande el form se ejecuta esta funcion que le va a permitir o no el inicio de sesion
  const handleLogin = async ( formData : UserLoginForm ) => {
    try {
      const message = await loginAccount( formData );
      toast.success(message);
    } catch (error) {
      if( error instanceof Error ) {
        toast.error(error.message);
      }
    }
  }

  return (
    <>
      <h1 className="text-center font-bold text-4xl my-10">
        <span className="text-blue-500">Inicia Sesión {""}</span>
        y Comienza a Aprender
      </h1>

      <div className="bg-white mx-auto max-w-5xl md:grid md:grid-cols-2 rounded-2xl overflow-hidden shadow md:h-102.5">
        <form 
          className="space-y-2 p-5 overflow-y-scroll"
          noValidate
          onSubmit={handleSubmit(handleLogin)}
        >
          <legend className="text-center font-bold text-2xl">Llena todos los campos</legend>

          <div className="flex flex-col">
            <label 
              htmlFor="email"
              className="text-gray-600 text-2xl font-bold"
            >Email</label>
            <input 
              type="email" 
              id="email"
              placeholder="Escribe tu email aqu&iacute;" 
              className="border border-gray-400 p-2 my-3 w-full rounded-lg"
              {...register("email", {
                required: "El email es obligatorio",
                pattern: {
                  value:  /\S+@\S+\.\S+/,
                  message: "E-mail no valido"
                }
              })}
            />
          </div>
          {errors.email && (
            <ErrorMessage>{errors.email.message}</ErrorMessage>
          )}

          <div className="flex flex-col">
            <label 
              htmlFor="password"
              className="text-gray-600 text-2xl font-bold"
            >Contrase&ntilde;a</label>

            <input 
              type="password"
              id="password"
              placeholder="Escribe tu contraseña aqu&iacute;"
              className="border border-gray-400 p-2 my-3 w-full rounded-lg"
              {
                ...register("password", {
                  required: "La constrasena es obligatoria"
                })
              }
            />
          </div>
          {errors.password && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
          )}

          <div className="flex justify-between items-center space-y-5 flex-col md:items-start md:flex-row">
            <Link to="/auth/register" className="text-blue-500 hover:text-blue-800"> &iquest;A&uacute;n no tienes una cuenta?</Link>
            <Link to="/auth/forgot-password" className="text-blue-500 hover:text-blue-800"> &iquest;Olvidaste tu contrase&ntilde;a?</Link>
          </div>

          <input 
            type="submit"
            value="Iniciar sesión"
            className="bg-blue-500 py-2 px-6 w-full block mx-auto text-white font-bold rounded-lg hover:cursor-pointer 
            hover:transition-colors hover:bg-blue-600 md:w-auto"
          />
        </form>

        <div className="bg-[url(/login.png)] bg-no-repeat bg-cover"></div>
      </div>
    </>
  )
}

export default LoginView;