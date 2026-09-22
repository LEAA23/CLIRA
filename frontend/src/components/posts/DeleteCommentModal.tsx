import { Transition, Dialog } from "@headlessui/react";
import { Fragment } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
import { useShowModal } from "../../hooks/useShowModal";
import { useAppStore } from "../../stores/useAppStore";
import { useForm } from "react-hook-form";
import { TrashIcon, XMarkIcon } from "@heroicons/react/16/solid";

const DeleteCommentModal = () => {
    const navigate = useNavigate();
    
    const showModal = useShowModal("DeleteCommentModal");
    const comment = useAppStore( state => state.comment );
    const group = useAppStore( state => state.group );

    const { handleSubmit } = useForm();

    const handleDeleteComment = () => {

    }
  return (
    <>
        <Transition appear show={showModal} as={Fragment}>
            <Dialog as="div" className="relative z-10" 
                onClose={() => {
                    navigate(`/groups/${group.id}?viewPost=true&post=${comment.post_id}`);
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
                                    Eliminar Comentario
                                </Dialog.Title>


                                <div className="p-5 max-w-full mt-5">
                                    <form
                                        onSubmit={ handleSubmit( handleDeleteComment ) }
                                    >

                                        <div className="flex flex-col">
                                            <label 
                                                htmlFor="content"
                                                className="text-gray-600 font-bold text-xl"
                                            >Comentario</label>
                                            <input 
                                                id="name"
                                                type="content"
                                                placeholder="Escribe el contenido del comentario aqui"
                                                className="border border-gray-400 p-2 my-3 w-full rounded-lg"

                                            />

                                        </div>
                                        

                                        <div className='flex flex-col md:flex-row justify-center gap-x-10'>
                                    
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    navigate(`/groups/${group.id}?viewPost=true&post=${comment.post_id}`);
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
                                                <TrashIcon className="h-6"/>
                                                Eliminar comentario
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

export default DeleteCommentModal