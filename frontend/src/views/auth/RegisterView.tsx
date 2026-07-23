import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import ErrorMessage from "../../components/ErrorMessage";
import type { UserRegistrationForm } from "../../types";
import { useAppStore } from "../../stores/useAppStore";
import { toast } from "react-toastify";

const RegisterView = () => {
    //Extraemos la funcion de nuestro store que nos va a permitir crear al usuario
    const createAccount = useAppStore( (state) => state.createAccount );

    //Valores iniciales que van a tener los campos del formulario
    const initialValues : UserRegistrationForm = {
        name: "",
        lastName: "",
        rol: "",
        phoneNumber: "",
        email: "",
        password: "",
        repeatPassword: ""
    }

    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<UserRegistrationForm>( { defaultValues: initialValues } );

    //Estamos al pendiente por cada cambio que ocurra en el campo de password para poder hacer validaciones personalizadas
    const password = watch("password");

    //Consumimos la api una vez mandado el formulario y mostramos las alertas de retroalimentacion
    const handleRegister = async( formData : UserRegistrationForm ) => {
        try {
            const message = await createAccount(formData);
            toast.success(message);
            reset();
        } catch (error) {
            if(error instanceof Error) {
                toast.error(error.message);
            }
        }
    }

  return (
    <>
        <h1 className="text-center font-bold text-4xl my-10">
            <span className="text-blue-500">Crea tu cuenta {""}</span>
            y Prueba Nuestras Herramientas
        </h1>

        <div className="bg-white mx-auto max-w-5xl md:grid md:grid-cols-2 rounded-2xl overflow-hidden shadow md:h-102.5">
            <form 
                className="space-y-2 p-5 overflow-y-scroll"
                noValidate
                onSubmit={handleSubmit(handleRegister)}
            >
                <legend className="text-2xl text-center font-bold">Llena todos los campos</legend>

                <div className="flex flex-col">
                    <label htmlFor="name" className="text-2xl font-bold text-gray-600">Nombre</label>
                    <input 
                        type="text"
                        id="name"
                        placeholder="Escribe tu nombre aqu&iacute;"
                        className="border border-gray-400 p-2 my-3 w-full rounded-lg"
                        {...register("name", {
                            required: "El nombre es obligatorio"
                        })} 
                    />
                </div>
                {errors.name && (
                    <ErrorMessage>{ String(errors.name.message) }</ErrorMessage>
                )}

                <div className="flex flex-col">
                    <label htmlFor="lastName" className="text-2xl font-bold text-gray-600">Apellidos</label>
                    <input
                        type="text"
                        id="lastName"
                        placeholder="Escribe tus apellidos aqu&iacute;"
                        className="border border-gray-400 p-2 my-3 w-full rounded-lg"
                        {...register("lastName", {
                            required: "Los apellidos son obligatorios"
                        })}
                    />
                </div>
                {errors.lastName && (
                    <ErrorMessage>{ String(errors.lastName.message) }</ErrorMessage>
                )}

                <div className="flex flex-col">
                    <label htmlFor="rol" className="text-gray-600 font-bold text-2xl">Rol</label>

                    <select 
                        id="rol"
                        className="border border-gray-400 p-2 my-3 rounded-lg w-full"
                        defaultValue=""
                        {...register("rol", {
                            required: "El rol es obligatorio"
                        })}
                    >
                        <option value="" disabled>-- Selecciona un rol --</option>
                        <option value="student">Estudiante</option>
                        <option value="teacher">Maestro/Doctor</option>
                    </select>
                </div>
                {errors.rol && (
                    <ErrorMessage>{ String(errors.rol.message) }</ErrorMessage>
                )}

                <div className="flex flex-col">
                    <label htmlFor="phoneNumber" className="text-gray-600 font-bold text-2xl">Tel&eacute;fono</label>
                    <input 
                        type="tel"
                        id="phoneNumber"
                        placeholder="Escribe tu numero de tel&eacute;fono aqu&iacute;"
                        className="border border-gray-400 p-2 my-3 w-full rounded-lg"
                        {...register("phoneNumber", {
                            required: "El numero de telefono es obligatorio"
                        })}
                    />
                </div>
                {errors.phoneNumber && (
                    <ErrorMessage>{ String(errors.phoneNumber.message) }</ErrorMessage>
                )}

                <div className="flex flex-col">
                    <label htmlFor="email" className="text-gray-600 font-bold text-2xl">E-mail</label>
                    <input 
                        type="email"
                        id="email"
                        placeholder="Escribe tu e-mail aqu&iacute;"
                        className="border border-gray-400 p-2 my-3 rounded-lg w-full"
                        {...register("email", {
                            required: "El email es obligatorio",
                            pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: "E-mail no válido"
                            }
                        })}
                    />
                </div>
                {errors.email && (
                    <ErrorMessage>{ String(errors.email.message) }</ErrorMessage>
                )}

                <div className="flex flex-col">
                    <label htmlFor="password" className="text-2xl font-bold text-gray-600">Contrase&ntilde;a</label>
                    <input 
                        type="password"
                        id="password"
                        placeholder="Escribe tu contrase&ntilde;a aqu&iacute;"
                        className="border border-gray-400 p-2 my-3 w-full rounded-lg"
                        {...register("password", {
                            required: "La contraseña es obligatoria",
                            minLength: {
                                value: 8,
                                message: "La contraseña debe ser de mínimo 8 caracteres"
                            }
                        })} 
                    />
                </div>
                {errors.password && (
                    <ErrorMessage>{ String(errors.password.message) }</ErrorMessage>
                )}

                <div className="flex flex-col">
                    <label htmlFor="repeatPassword" className="text-gray-600 font-bold text-2xl">Repite tu contrase&ntilde;a</label>
                    <input 
                        type="password"
                        id="repeatPassword"
                        placeholder="Repite tu contrase&ntilde;a de nuevo"
                        className="border border-gray-400 p-2 my-3 w-full rounded-lg"
                        {...register("repeatPassword", {
                            required: "Repite de nuevo la contraseña",
                            validate: value => value === password || "Las contraseñas no coinciden"
                        })}
                    />
                </div>
                {errors.repeatPassword && (
                    <ErrorMessage>{ String(errors.repeatPassword.message) }</ErrorMessage>
                )}

                <div className="flex justify-between items-center space-y-5 flex-col md:items-start md:flex-row">
                    <Link to="/auth/login" className="text-blue-500 hover:text-blue-800">&iquest;Ya tienes una cuenta?</Link>
                    <Link to="/auth/forgot-password" className="text-blue-500 hover:text-blue-800">&iquest;Olvidaste tu contrase&ntilde;a?</Link>
                </div>

                <input 
                    type="submit"
                    value="Crear cuenta"
                    className="bg-blue-500 py-2 px-6 w-full block mx-auto text-white font-bold rounded-lg hover:cursor-pointer hover:transition-colors hover:bg-blue-600 md:w-auto" 
                />
            </form>

            <div className="bg-[url(/register.png)] bg-cover bg-no-repeat"></div>
        </div>
    </>
  )
}

export default RegisterView;