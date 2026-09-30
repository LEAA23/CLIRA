import { Transition, Dialog } from "@headlessui/react";
import { ArrowUpTrayIcon, PencilIcon, XMarkIcon } from "@heroicons/react/16/solid";
import { useShowModal } from "../../hooks/useShowModal";
import { Fragment } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useAppStore } from "../../stores/useAppStore";
import { toast } from "react-toastify";


const UserProfileUpdateImageModal = () => {
    const showModal = useShowModal( "EditImage" );

    const navigate = useNavigate();

    const userProfileSearched = useAppStore( state => state.userProfileSearched );

    const { handleSubmit } = useForm();

    const [ selectedImage, setSelectedImage ] = useState<File | null>(null);
    

    const handleUpdateImage = async() => {
        const data = new FormData();
        //Si la imagen es diferente de null significa que el usuario si selecciono una nueva imagen, entonces la agregamos a la instancia de FormData
        if(selectedImage !== null) {
            data.append("image", selectedImage);
        }

        try {
            
        } catch (error) {
            if( error instanceof Error ) {
                toast.error( error.message );
            }
        }
    }

    //Construimos una URL temporal para poder renderizarla en el componnete cuando el usuario seleccione una imagen
    const file = selectedImage;
    let mediaURL = file? URL.createObjectURL(file): null; 

  return (
    <>
        <Transition appear show={showModal} as={Fragment}>
            <Dialog as="div" className="relative z-10" 
                onClose={() => {
                    navigate(location.pathname, { replace: true });
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
                            <Dialog.Panel className="w-5/6 max-w-5xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-3 lg:p-10">
                                <Dialog.Title
                                    as="h3"
                                    className="font-black text-4xl my-2 text-center"
                                >
                                    Editar Imagen del Perfil
                                </Dialog.Title>

                                            
                                <form
                                    className="space-y-2 p-5"
                                    onSubmit={ handleSubmit( handleUpdateImage ) }
                                >
                                    <div className="flex flex-col justify-between space-x-5">
                                        <label 
                                            htmlFor="image"
                                            className="text-gray-600 text-2xl font-bold"
                                        >Imagen</label>

                                        {userProfileSearched.profileImage !== null? (
                                            <div className="mt-5">
                                                <p className="text-sm text-gray-600 font-semibold mb-5">Imagen previamente seleccionada:</p>

                                                <div className="flex justify-start space-x-5 space-y-5 items-center flex-wrap">
                                                    
                                                    <div className="relative">
                                                        <img 
                                                            key={ "" }
                                                            src={ "" } 
                                                            alt="Vista previa de imagen de fondo"
                                                            className="h-36" 
                                                        />

                                                    </div>

                                                </div>
                                            </div>
                                        ): (
                                            <p>A&uacute;n no hay una imagen de perfil seleccionada.</p>
                                        )}
                                        
                                        <input
                                            id="image"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            name="images"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];

                                                if(file) {
                                                    setSelectedImage(file);
                                                }
                                            }}
                                        />
                                        <label 
                                            htmlFor="image"
                                            className="bg-purple-500 py-2 px-6 text-white font-bold rounded-lg mt-10 md:mt-5 
                                            hover:cursor-pointer hover:transition-colors hover:bg-purple-600 w-full flex 
                                            justify-center items-center gap-x-2"
                                        >
                                            <ArrowUpTrayIcon className="h-6"/>
                                            Seleccionar nueva imagen
                                        </label>

                                        {mediaURL && (
                                            <div className="mt-5">
                                                <p className="text-sm text-gray-600 font-semibold mb-5">Imagen seleccionada:</p>

                                                <div className="flex justify-start space-x-5 space-y-5 items-center flex-wrap">
                                                    <div className="relative">
                                                        <img 
                                                            key={mediaURL}
                                                            src={ mediaURL } 
                                                            alt="Vista previa de imagen de fondo"
                                                            className="h-36" 
                                                        />

                                                        <div 
                                                            className="absolute top-1 right-1 bg-red-400 h-8 aspect-square rounded-full
                                                                        hover:bg-red-500 cursor-pointer p-1"
                                                            onClick={ () => setSelectedImage(null) }
                                                        >
                                                            <p className="font-bold text-white text-center">X</p>
                                                        </div>

                                                    </div>              
                                                </div>
                                            </div>
                                        )}

                                    </div>

                                    <div className='flex flex-col md:flex-row justify-center gap-x-10 mt-10 lg:mt-0'>
                                    
                                        <button
                                            type="button"
                                            onClick={() => {
                                                navigate(location.pathname, { replace: true });
                                                setSelectedImage(null);
                                            }}
                                            className="bg-red-400 py-2 px-6 w-full mb-3 lg:mb-0 lg:mt-10 text-white font-bold rounded-lg hover:cursor-pointer 
                                            hover:transition-colors hover:bg-red-500 md:w-auto flex justify-center md:justify-start items-center gap-x-2"
                                        >
                                            <XMarkIcon className="h-6"/>
                                            Cancelar
                                        </button> 

                                        <button
                                            type="submit"
                                            className="bg-blue-500 py-2 px-6 w-full mb-3 lg:mb-0 lg:mt-10 text-white font-bold rounded-lg hover:cursor-pointer 
                                            hover:transition-colors hover:bg-blue-600 md:w-auto flex justify-center md:justify-start items-center gap-x-2"
                                        >
                                            <PencilIcon className="h-6"/>
                                            Editar
                                        </button>  
                                    </div>
                                </form>
                               
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    </>
  )
}

export default UserProfileUpdateImageModal;