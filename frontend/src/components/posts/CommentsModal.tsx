import { Transition, Dialog } from "@headlessui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import CommentaCard from "./CommentCard";
import { PaperAirplaneIcon, TrashIcon } from "@heroicons/react/16/solid";

const CommentsModal = () => {
    const navigate = useNavigate();

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const commentsModal = queryParams.get("commentsModal");
    const showModal = commentsModal? true: false;

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
                            <Dialog.Panel className="w-5/6 max-w-5xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-16">
                                <Dialog.Title
                                    as="h3"
                                    className="font-black text-4xl my-2 text-center"
                                >
                                    {"Comentarios"}
                                </Dialog.Title>
                                <div className="overflow-hidden">
                                    <div className="flex flex-col space-y-5 h-100 p-5 overflow-y-scroll">
                                    <CommentaCard/>
                                    <CommentaCard/>
                                    <CommentaCard/>
                                    <CommentaCard/>
                                    <CommentaCard/>

                                    </div>
                                </div>

                                <div className="bg-white shadow-xl p-5 rounded-lg max-w-full my-5">
                                    <form>
                                        <label 
                                            htmlFor="comment"
                                            className="text-gray-600 font-bold text-xl"
                                        >Comentario</label>
                                        <textarea 
                                            id="comment"
                                            className="border border-gray-400 p-2 mt-3 w-full rounded-lg"
                                        ></textarea>

                                        <div className='flex flex-col md:flex-row justify-center gap-x-10'>
                                    
                                            <button
                                                type="button"
                                                onClick={() => navigate(location.pathname, { replace: true })}
                                                className="bg-red-400 py-2 px-6 w-full mt-10 text-white font-bold rounded-lg hover:cursor-pointer 
                                                hover:transition-colors hover:bg-red-500 md:w-auto flex justify-start items-center gap-x-2"
                                            >
                                                <TrashIcon className="h-6"/>
                                                Borrar
                                            </button> 

                                            <button
                                                type="submit"
                                                className="bg-blue-500 py-2 px-6 w-full mt-10 text-white font-bold rounded-lg hover:cursor-pointer 
                                                hover:transition-colors hover:bg-blue-600 md:w-auto flex justify-start items-center gap-x-2"
                                            >
                                                <PaperAirplaneIcon className="h-6"/>
                                                Publicar
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

export default CommentsModal