import { Transition, Dialog } from "@headlessui/react";
import { ArrowRightStartOnRectangleIcon, ArrowUpTrayIcon, PlusIcon } from "@heroicons/react/16/solid";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import ErrorMessage from "../ErrorMessage";
import type { GroupRegistrationForm } from "../../types";
import { toast } from "react-toastify";
import { useAppStore } from "../../stores/useAppStore";
import { useShowModal } from "../../hooks/useShowModal";

const CreateGroupModal = () => {
    const navigate = useNavigate();
    //Extraemos si mostramos el modal o no
    const showModal = useShowModal("createGroup");

    //Extraemos la funcion para crear el grupo de nuestro slice
    const createGroup = useAppStore( state => state.createGroup );
    const fetchGroups = useAppStore( state => state.fetchGroups );

    //Tipamos los valores inciales del formulario
    const initialValues : GroupRegistrationForm = {
        name: "",
        bgImage: []
    }

    const { register, reset, handleSubmit, formState: { errors }, watch } = useForm<GroupRegistrationForm>( { defaultValues: initialValues } );

    //Miramos por cambios en el cmapo de bgImage con el fin de renderizar la imagen del grupo una vez seleccionada
    const bgImage = watch("bgImage");
    const file = bgImage?.[0];
    //Mediante URL.createObjectURL() creamos una URL temporal para poder renderizar la imagen
    const imageURL = file? URL.createObjectURL(file) : null;

    const handleSubmitGroup = async ( formData : GroupRegistrationForm ) => {

        //Creamos un objeto de FormData() para poder mandar archvivos en un formulario
        const data = new FormData();
        data.append("name", formData.name);
        data.append("bgImage", formData.bgImage[0]);

        try {
            const message = await createGroup(data);
            await fetchGroups();
            toast.success( message );
            reset();
            navigate( location.pathname, { replace: true } );
        } catch (error) {
            if( error instanceof Error ) {
                toast.error(error.message);
            }
        }
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
                                    Crear Nuevo Grupo
                                </Dialog.Title>


                                <div className="p-5 max-w-full mt-5">
                                    <form
                                        onSubmit={ handleSubmit(handleSubmitGroup) }
                                    >

                                        <div className="flex flex-col">
                                            <label 
                                                htmlFor="name"
                                                className="text-gray-600 font-bold text-xl"
                                            >Nombre</label>
                                            <input 
                                                id="name"
                                                type="text"
                                                placeholder="Escribe el nombre del grupo aqui"
                                                className="border border-gray-400 p-2 my-3 w-full rounded-lg"
                                                {...register("name", {
                                                    required: "El nombre del grupo es obligatorio"
                                                })}
                                            />
                                            {errors.name && (
                                                <ErrorMessage>{ String(errors.name.message) }</ErrorMessage>
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
                                            {imageURL && (
                                                <div className="mt-5">
                                                    <p className="text-sm text-gray-600 font-semibold mb-5">Imagen seleccionada:</p>
                                                    <img 
                                                        src={ imageURL } 
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
                                                Crear grupo
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

export default CreateGroupModal