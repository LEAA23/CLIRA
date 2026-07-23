import { toast } from "react-toastify";
import { updatePassword } from "../../api/authApi";
import type { UserNewPasswordForm, UserUpdatePassword } from "../../types";
import ErrorMessage from "../ErrorMessage";
import { useForm } from "react-hook-form";

type ResetPasswordFormProps = {
    token: string;
}

const ResetPasswordForm = ({token} : ResetPasswordFormProps) => {
    
    const initialValues : UserNewPasswordForm = {
        password: "",
        repeatPassword: ""
    }

    const { register, handleSubmit, watch, formState: { errors } } = useForm<UserNewPasswordForm>({ defaultValues: initialValues });
    const password = watch("password");

    const handleUpdatePassword = async( formData : UserNewPasswordForm ) => {
        try {
            const data : UserUpdatePassword = {
                password: formData.password,
                repeatPassword: formData.repeatPassword,
                token: token!
            }
            const message = await updatePassword( data );
            toast.success(message);
        } catch (error) {
            if( error instanceof Error ) {
                toast.error(error.message);
            }
            
            throw error;
        }
    }
  return (
    <>
        <h1 className="text-center font-bold text-4xl my-10">
            <span className="text-blue-500">Ingresa tu Nueva {""}</span>
            Contrase&ntilde;a
        </h1>

        <div className="bg-white max-w-5xl mx-auto rounded-2xl shadow md:grid md:grid-cols-2 overflow-hidden md:h-102.5">
            <form
                className="space-y-5 p-5 overflow-y-scroll"
                noValidate
                onSubmit={handleSubmit(handleUpdatePassword)}
            >
                <legend className="text-center text-2xl font-bold">Llena todos los campos</legend>

                <div className="flex flex-col">
                    <label htmlFor="password" className="text-gray-600 font-bold text-2xl">Nueva contrase&ntilde;a</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Escribe tu nueva contraseña aqui"
                        className="border border-gray-400 p-2 my-3 w-full rounded-lg"
                        {...register("password", {
                            required: "La contraseña es obligatoria",
                            minLength: {
                                value: 8,
                                message: "La contraseña debe tener minimo 8 caracteres"
                            }
                        })}
                    />
                </div>
                {errors.password && (
                    <ErrorMessage>{ String(errors.password.message) }</ErrorMessage>
                )}

                <div className="flex flex-col">
                    <label htmlFor="repeatPassword" className="text-2xl text-gray-600 font-bold">Repite tu nueva contraseña</label>
                    <input
                        type="password"
                        id="repeatPassword"
                        placeholder="Escribe otra vez tu nueva contraseña aqui"
                        className="border border-gray-400 p-2 my-3 w-full rounded-lg"
                        {...register("repeatPassword", {
                            required: "Debes repetir tu nueva contraseña",
                            validate: value => value === password || "Las contraseñas no coinciden"
                        })}
                    />
                </div>
                {errors.repeatPassword && (
                    <ErrorMessage>{ String(errors.repeatPassword.message) }</ErrorMessage>
                )}

                <input
                    type="submit"
                    value="Cambiar contraseña"
                    className="bg-blue-500 py-2 px-6 w-full block mx-auto text-white font-bold rounded-lg hover:cursor-pointer hover:transition-colors hover:bg-blue-600 md:w-auto"
                />
            </form>
            
            <div className="bg-[url(/newPassword.png)] bg-no-repeat bg-cover"></div>
        </div>
    </>
  )
}

export default ResetPasswordForm;