import { Transition, Dialog } from "@headlessui/react";
import { Fragment } from "react/jsx-runtime";
import { useShowModal } from "../../hooks/useShowModal";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import ErrorMessage from "../ErrorMessage";
import { ArrowRightStartOnRectangleIcon, ArrowUpTrayIcon, PlusIcon } from "@heroicons/react/16/solid";

const CreateCaseModal = () => {
    const showModal = useShowModal( "CreateCase" );

    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm();

    const handleSubmitCase = () => {

    }

  return (
    <>
        <Transition appear show={showModal} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => navigate(location.pathname, { replace: true })}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/60" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-5/6 max-w-5xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-10">
                                <Dialog.Title
                                    as="h3"
                                    className="font-black text-4xl my-2 text-center"
                                >
                                    Crear Nuevo Caso Clinico
                                </Dialog.Title>


                                <div className="p-5 max-w-full mt-5">
                                    <form
                                        onSubmit={ handleSubmit(handleSubmitCase) }
                                    >

                                        <div className="flex flex-col">
                                            <label 
                                                htmlFor="title"
                                                className="text-gray-600 font-bold text-xl"
                                            >Titulo</label>
                                            <input 
                                                id="title"
                                                type="text"
                                                placeholder="Escribe el titulo del caso aqui"
                                                className="border border-gray-400 p-2 my-3 w-full rounded-lg"
                                                {...register("title", {
                                                    required: "El titulo del caso es obligatorio"
                                                })}
                                            />
                                            {errors.title && (
                                                <ErrorMessage>{ String(errors.title.message) }</ErrorMessage>
                                            )}
                                        </div>

                                        <div className="flex flex-col">
                                            <label 
                                                htmlFor="description"
                                                className="text-gray-600 font-bold text-xl"
                                            >Descripci&oacute;n del caso</label>
                                            <textarea 
                                                id="description"
                                                className="border border-gray-400 p-2 my-3 w-full rounded-lg"
                                                {...register("description", {
                                                    required: "La descripcion del caso es obligatorio"
                                                })}
                                            ></textarea>
                                            {errors.description && (
                                                <ErrorMessage>{ String(errors.description.message) }</ErrorMessage>
                                            )}
                                        </div>

                                        <div className="flex flex-col">
                                            <label 
                                                htmlFor="bgImage"
                                                className="text-gray-600 font-bold text-xl"
                                            >Imagen de fondo</label>
                                            <input 
                                                id="bgImage"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                {...register("bgImage", {
                                                    required: "La imagen de fondo es obligatoria"
                                                })}
                                            />
                                            <label 
                                                htmlFor="bgImage"
                                                className="bg-purple-500 py-2 px-6 text-white font-bold rounded-lg mt-10 md:mt-5 
                                                hover:cursor-pointer hover:transition-colors hover:bg-purple-600 w-full flex 
                                                justify-center items-center gap-x-2"
                                            >
                                                <ArrowUpTrayIcon className="h-6"/>
                                                Seleccionar imagen
                                            </label>
                                            {errors.bgImage && (
                                                <ErrorMessage>{ String(errors.bgImage.message) }</ErrorMessage>
                                            )}
                                            {1 && (
                                                <div className="mt-5">
                                                    <p className="text-sm text-gray-600 font-semibold mb-5">Imagen seleccionada:</p>
                                                    <img 
                                                        src={ "" } 
                                                        alt="Vista previa de imagen de fondo"
                                                        className="w-1/2 h-full" 
                                                    />
                                                </div>
                                            )}
                                            
                                        </div>

                                        <div className='flex flex-col md:flex-row mt-5 justify-center gap-x-10'>
                                    
                                            <button
                                                type="button"
                                                onClick={() => navigate(location.pathname, { replace: true })}
                                                className="bg-red-400 py-2 px-6 w-full mt-5 text-white font-bold rounded-lg hover:cursor-pointer 
                                                hover:transition-colors hover:bg-red-500 md:w-auto flex md:justify-start justify-center items-center gap-x-2"
                                            >
                                                <ArrowRightStartOnRectangleIcon className="h-6"/>
                                                Salir
                                            </button> 

                                            <button
                                                type="submit"
                                                className="bg-blue-500 py-2 px-6 w-full mt-5 text-white font-bold rounded-lg hover:cursor-pointer 
                                                hover:transition-colors hover:bg-blue-600 md:w-auto flex md:justify-start justify-center items-center gap-x-2"
                                            >
                                                <PlusIcon className="h-6"/>
                                                Crear Caso
                                            </button>  
                                        </div>
                                    </form>

                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    </>
  )
}

export default CreateCaseModal