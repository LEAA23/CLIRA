import { Transition, Dialog } from "@headlessui/react";
import { PencilIcon, XMarkIcon } from "@heroicons/react/16/solid";
import { useLocation, useNavigate } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import { useShowModal } from "../../hooks/useShowModal";
import { useAppStore } from "../../stores/useAppStore";
import { useForm } from "react-hook-form";
import ErrorMessage from "../ErrorMessage";
import { useEffect } from "react";

const EditCommentModal = () => {
    const navigate = useNavigate();
    //Extraemos si mostramos el modal o no
    const showModal = useShowModal("EditCommentModal");
    
    const location = useLocation();
    const queryParams = new URLSearchParams( location.search );
    const commentId = queryParams.get("Comment");

    const group = useAppStore( state => state.group );
    const fetchComment = useAppStore( state => state.fecthComment );
    const cleanComment = useAppStore( state => state.cleanComment );
    const comment = useAppStore( state => state.comment );
    
    const { register, reset, formState: { errors }, handleSubmit } = useForm();
    
    useEffect(() => {
        if(commentId) {
            fetchComment( Number( commentId ) );
        }

    }, [fetchComment, commentId]);

    useEffect(() => {
        if(comment) {
            reset({
                content: comment.content
            });

        }
    }, [ comment, reset ])


    const handleUpdateComment = async() => {

    }



  return (
    <>
        <Transition appear show={showModal} as={Fragment}>
            <Dialog as="div" className="relative z-10" 
                onClose={() => {
                    navigate(`/groups/${group.id}?viewPost=true&post=${comment.post_id}`);
                    cleanComment();
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
                                    Editar Comentario
                                </Dialog.Title>


                                <div className="p-5 max-w-full mt-5">
                                    <form
                                        onSubmit={ handleSubmit( handleUpdateComment ) }
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
                                                {...register("content", {
                                                    required: "El comentario debe contener minimo 1 caracter"
                                                })}
                                            />
                                            {errors.content && (
                                                <ErrorMessage>{ String( errors.content.message ) }</ErrorMessage>
                                            )}
                                        </div>
                                        

                                        <div className='flex flex-col md:flex-row justify-center gap-x-10'>
                                    
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    navigate(`/groups/${group.id}?viewPost=true&post=${comment.post_id}`);
                                                    cleanComment();
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
                                                Editar comentario
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

export default EditCommentModal;