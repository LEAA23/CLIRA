import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import ErrorMessage from "../../components/ErrorMessage";
import type { UserLoginForm } from "../../types";
import { useAppStore } from "../../stores/useAppStore";
import { toast } from "react-toastify";

const LoginView = () => {
  // Función de inicio de sesión
  const loginAccount = useAppStore((state) => state.login);
  const navigate = useNavigate();

  // Valores iniciales del formulario
  const initialValues: UserLoginForm = {
    email: "",
    password: ""
  };

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<UserLoginForm>({
    defaultValues: initialValues
  });

  // Función para iniciar sesión
  const handleLogin = async (formData: UserLoginForm) => {
    try {
      await loginAccount(formData);
      navigate("/");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <>
      <h1 className="text-center font-bold text-4xl my-10">
        <span className="text-blue-500">Inicia Sesión </span>
        y Comienza a Aprender
      </h1>

      {/* Contenedor general */}
      <div className="relative w-full flex items-center justify-center px-4">

        {/* 
          Squirtle izquierdo 
          <img
            src="/gifs/baile-insano-squirtle"
            alt="Squirtle bailando a la izquierda"
            className="hidden lg:block absolute left-0 xl:left-6 bottom-5 w-32 xl:w-44 object-contain z-0"
          /> 
        */}

        {/* Tarjeta del login */}
        <div className="relative z-10 bg-white mx-auto max-w-5xl w-full md:grid md:grid-cols-2 rounded-2xl overflow-hidden shadow md:h-102.5">

          <form
            className="space-y-2 p-5 overflow-y-scroll"
            noValidate
            onSubmit={handleSubmit(handleLogin)}
          >
            <legend className="text-center font-bold text-2xl">
              Llena todos los campos
            </legend>

            {/* Email */}
            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="text-gray-600 text-2xl font-bold"
              >
                Email
              </label>

              <input
                type="email"
                id="email"
                placeholder="Escribe tu email aquí"
                className="border border-gray-400 p-2 my-3 w-full rounded-lg"
                {...register("email", {
                  required: "El email es obligatorio",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Introduce un correo electrónico válido"
                  }
                })}
              />
            </div>

            {errors.email && (
              <ErrorMessage>{errors.email.message}</ErrorMessage>
            )}

            {/* Contraseña */}
            <div className="flex flex-col">
              <label
                htmlFor="password"
                className="text-gray-600 text-2xl font-bold"
              >
                Contraseña
              </label>

              <input
                type="password"
                id="password"
                placeholder="Escribe tu contraseña aquí"
                className="border border-gray-400 p-2 my-3 w-full rounded-lg"
                {...register("password", {
                  required: "La contraseña es obligatoria"
                })}
              />
            </div>

            {errors.password && (
              <ErrorMessage>{errors.password.message}</ErrorMessage>
            )}

            {/* Enlaces */}
            <div className="flex justify-between items-center space-y-5 flex-col md:items-start md:flex-row">
              <Link
                to="/auth/register"
                className="text-blue-500 hover:text-blue-800"
              >
                ¿Aún no tienes una cuenta?
              </Link>

              <Link
                to="/auth/forgot-password"
                className="text-blue-500 hover:text-blue-800"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Botón */}
            <button
              type="submit"
              className="bg-blue-500 py-2 px-6 w-full block mx-auto text-white font-bold rounded-lg cursor-pointer transition-colors hover:bg-blue-600 md:w-auto"
            >
              Iniciar sesión
            </button>
          </form>

          {/* Imagen original del login */}
          <div className="bg-[url(/login.png)] dark:bg-[url(/login.png)] bg-no-repeat bg-cover bg-center"></div>
        </div>

        {/* Squirtle derecho */}
        {/* 
        <img
          src="/gifs/baile-insano-squirtle."
          alt="Squirtle bailando a la derecha"
          className="hidden lg:block absolute right-0 xl:right-6 bottom-5 w-32 xl:w-44 object-contain z-0"
        /> 
        */}

      </div>
    </>
  );
};

export default LoginView;