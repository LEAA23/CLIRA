import { Transition, Dialog } from "@headlessui/react";
import { ArrowUpTrayIcon, PencilIcon, XMarkIcon } from "@heroicons/react/16/solid";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import ErrorMessage from "../ErrorMessage";
import type { GroupRegistrationForm } from "../../types";
import { toast } from "react-toastify";
import { useAppStore } from "../../stores/useAppStore";
import { useShowModal } from "../../hooks/useShowModal";
import { useEffect } from "react";

const EditGroupModal = () => {
    const navigate = useNavigate();
    //Extraemos si mostramos el modal o no
    const showModal = useShowModal("EditGroupModal");
    
    const location = useLocation();
    const queryParams = new URLSearchParams( location.search );
    const groupId = queryParams.get("Group");

    //Extraemos la funcion para crear el grupo de nuestro slice
    const updateGroup = useAppStore( state => state.updateGroup );
    const fetchGroups = useAppStore( state => state.fetchGroups );
    
    //Extraemos fetchGroup para llenar el form con los datos del id del grupo y el state de group para mostrarlos
    const fetchGroup = useAppStore( state => state.fetchGroup );
    const group = useAppStore( state => state.group );
    //Extraemos la funcion para limpiar el state de grupo una vez que el usaurio cierre el modal
    const clearGroup = useAppStore( state => state.clearGroup );
    
    //Si hay un id de un grupo consultamos el grupo para traernos los datos
    useEffect(() => {
        const getGroup = async () => {
            if (groupId) {
                await fetchGroup(Number(groupId));
            }
        };

        getGroup();
    }, [groupId, fetchGroup]);

    //Tipamos los valores inciales del formulario
    const initialValues : GroupRegistrationForm = {
        name: "",
        bgImage: []
    }

    const { register, reset, handleSubmit, formState: { errors }, watch } = useForm<GroupRegistrationForm>( { defaultValues: initialValues } );

    //Si hay un grupo reseteamos el formulario con los valoes del grupo del estado, el cual esta llenado por datos de la BD
    useEffect(() => {
        if (group) {
            reset({
                name: group.name,
                bgImage: []
            });
        }
    }, [group, reset]);
    
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
            const message = await updateGroup( {groupId : Number(groupId), formData : data });
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
            <Dialog as="div" className="relative z-10" 
                onClose={() => {
                navigate(location.pathname, { replace: true })
                clearGroup();
                }}
            >
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
                                    Editar el Grupo
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

                                            <div className="grid grid-cols-1 md:grid-cols-2 space-x-5 w-full mb-5">
                                                <div className="mt-5">
                                                    <p className="text-sm text-gray-600 font-semibold mb-5">Imagen actual:</p>
                                                    <img 
                                                        src={ group.bgImage } 
                                                        alt="Vista previa de imagen de fondo"
                                                        className="w-full" 
                                                    />
                                                </div>

                                                {imageURL && (
                                                    <div className="mt-5">
                                                        <p className="text-sm text-gray-600 font-semibold mb-5">Imagen nueva:</p>
                                                        <img 
                                                            src={ imageURL } 
                                                            alt="Vista previa de imagen de fondo"
                                                            className="w-full" 
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                        </div>

                                        <div className='flex flex-col md:flex-row justify-center gap-x-10'>
                                    
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    navigate(location.pathname, { replace: true });
                                                    clearGroup();
                                                }}
                                                className="bg-red-400 py-2 px-6 w-full mt-5 text-white font-bold rounded-lg hover:cursor-pointer 
                                                hover:transition-colors hover:bg-red-500 md:w-auto flex justify-start items-center gap-x-2"
                                            >
                                                <XMarkIcon className="h-6"/>
                                                Cancelar
                                            </button> 

                                            <button
                                                type="submit"
                                                className="bg-blue-500 py-2 px-6 w-full mt-5 text-white font-bold rounded-lg hover:cursor-pointer 
                                                hover:transition-colors hover:bg-blue-600 md:w-auto flex justify-start items-center gap-x-2"
                                            >
                                                <PencilIcon className="h-6"/>
                                                Editar grupo
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

export default EditGroupModal;