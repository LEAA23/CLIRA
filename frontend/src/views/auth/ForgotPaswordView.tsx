import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import ErrorMessage from "../../components/ErrorMessage";
import type { UserForgotPasswordForm } from "../../types";
import { useAppStore } from "../../stores/useAppStore";
import { toast } from "react-toastify";

const ForgotPaswordView = () => {
    //Extaremos la funcion para mandar al email del usuario las indicaciones para reestablecer su password
    const forgotPassword = useAppStore( (state) => state.forgotPassword );
    const { register, handleSubmit, reset, formState: { errors } } = useForm<UserForgotPasswordForm>();

    const handleForgotPassword = async ( email : UserForgotPasswordForm ) => {
        try {
            const message = await forgotPassword( email );
            toast.success(message);
            reset();
        } catch (error) {
            if( error instanceof Error ) {
                toast.error(error.message);
            }
        }
    }

  return (
    <>
        <>
            <h1 className="text-center font-bold text-4xl my-10">
                <span className="text-blue-500">Recupera tu {""}</span>
                Acceso a CLIRA
            </h1>

            <div className="bg-white mx-auto max-w-5xl md:grid md:grid-cols-2 rounded-2xl overflow-hidden shadow md:h-102.5">
                <form 
                    className="space-y-2 p-5 my-auto"
                    noValidate
                    onSubmit={handleSubmit(handleForgotPassword)}
                >
                    <legend className="text-2xl text-center font-bold">Escribe tu e-mail para recibir instrucciones</legend>

                    <div className="flex flex-col">
                        <label htmlFor="email" className="font-bold text-2xl text-gray-600">E-mail</label>
                        <input  
                            type="email"
                            id="email"
                            placeholder="Escribe tu e-mail aqu&iacute;"
                            className="border border-gray-400 p-2 my-3 w-full rounded-lg"
                            {...register("email", {
                                required: "El e-mail es obligatorio",
                                pattern: {
                                    value:  /\S+@\S+\.\S+/,
                                    message: "E-mail no valido"
                                }
                            })} 
                        />
                    </div>
                    {errors.email && (
                        <ErrorMessage>{ String(errors.email.message) }</ErrorMessage>
                    )}

                    <div className="flex justify-between items-center space-y-5 flex-col md:items-start md:flex-row">
                        <Link to="/auth/login" className="text-blue-500 hover:text-blue-800">&iquest;Ya tienes una cuenta?</Link>
                        <Link to="/auth/register" className="text-blue-500 hover:text-blue-800">&iquest;A&uacute;n no tienes una cuenta?</Link>
                    </div>

                    <input 
                        type="submit"
                        value="Recibir instrucciones"
                        className="bg-blue-500 py-2 px-6 w-full block mx-auto text-white font-bold rounded-lg hover:cursor-pointer hover:transition-colors hover:bg-blue-600 md:w-auto" 
                    />
                </form>

                <div className="bg-[url(/phone.png)] bg-cover bg-no-repeat"></div>
            </div>
        </>
    </>
  )
}

export default ForgotPaswordView;