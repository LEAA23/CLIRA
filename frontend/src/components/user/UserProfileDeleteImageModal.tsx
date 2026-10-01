import { Transition, Dialog } from "@headlessui/react";
import { Fragment } from "react/jsx-runtime";
import { useShowModal } from "../../hooks/useShowModal";
import { useNavigate } from "react-router-dom";
import { TrashIcon, XMarkIcon } from "@heroicons/react/16/solid";

const UserProfileDeleteImageModal = () => {
    const showModal = useShowModal( "DeleteImage" );

    const navigate = useNavigate();

    const handleDeleteProfileImage = () => {

    }

  return (
    <>
        <Transition appear show={showModal} as={Fragment}>
            <Dialog as="div" className="relative z-10" 
                onClose={() => {
                    navigate( location.pathname, { replace: true } );
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
                                    Eliminar Imagen de Perfil
                                </Dialog.Title>

                                <div className="text-center mt-5 text-2xl">
                                    <p>&iquest;Estas seguro que quieres eliminar tu imagen de perfil?</p>
                                </div>

                                <div className="max-w-full p-5 lg:p-0">
                                    <form
                                        onSubmit={ handleDeleteProfileImage }
                                    >
                                        <input  id="groupId" name="groupId" type="hidden"/>

                                        <div className='flex flex-col md:flex-row mt-5 justify-center gap-x-10'>
                                    
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    navigate(location.pathname, { replace: true });
                                                    
                                                }}
                                                className="bg-blue-400 py-2 px-6 w-full mt-5 text-white font-bold rounded-lg hover:cursor-pointer 
                                                hover:transition-colors hover:bg-blue-500 md:w-auto flex md:justify-start justify-center items-center gap-x-2"
                                            >
                                                <XMarkIcon className="h-6"/>
                                                Cancelar
                                            </button> 

                                            <button
                                                type="submit"
                                                className="bg-red-500 py-2 px-6 w-full mt-5 text-white font-bold rounded-lg hover:cursor-pointer 
                                                hover:transition-colors hover:bg-red-600 md:w-auto flex md:justify-start justify-center items-center gap-x-2"
                                            >
                                                <TrashIcon className="h-6"/>
                                                Eliminar
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

export default UserProfileDeleteImageModal;