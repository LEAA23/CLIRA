import { Transition, Dialog } from "@headlessui/react";
import { EyeIcon, XMarkIcon } from "@heroicons/react/16/solid";
import { useLocation, useNavigate } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";

const PostModal = () => {
    //useNavigate para redireccionar al usuario a la misma pagina pero sin los query params
    const navigate = useNavigate();
    //Extraemos el queryParam de makePost para verificar si se debe o no mostar el modal para hacer una publicacion
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const makePost = queryParams.get("makePost");
    const showModal = makePost? true: false;

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
                                    Haz una publicaci&oacute;n
                                </Dialog.Title>

                                            
                                <form
                                    className="space-y-2 p-5"
                                >
                                    <div className="flex flex-col">
                                        <label 
                                            htmlFor="title"
                                            className="text-gray-600 text-2xl font-bold"
                                        >Titulo</label>
                                        <input 
                                            type="text" 
                                            id="title"
                                            placeholder="Escribe el titulo de la publicacion aqui"
                                            className="border border-gray-400 p-2 my-3 w-full rounded-lg"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label 
                                            htmlFor="content"
                                            className="text-gray-600 text-2xl font-bold"
                                        >Contenido</label>
                                        <textarea 
                                            id="content"
                                            className="border border-gray-400 p-2 my-3 w-full rounded-lg h-30"
                                        ></textarea>
                                    </div>

                                    <div className="flex justify-between space-x-5">
                                        <label 
                                            htmlFor="resource"
                                            className="text-gray-600 text-2xl font-bold"
                                        >Recursos</label>

                                    </div>

                                    <div className='flex flex-col md:flex-row justify-center gap-x-10'>
                                    
                                        <button
                                            type="button"
                                            onClick={() => navigate(location.pathname, { replace: true })}
                                            className="bg-red-400 py-2 px-6 w-full mt-10 text-white font-bold rounded-lg hover:cursor-pointer 
                                            hover:transition-colors hover:bg-red-500 md:w-auto flex justify-start items-center gap-x-2"
                                        >
                                            <XMarkIcon className="h-6"/>
                                            Cancelar
                                        </button> 

                                        <button
                                            type="submit"
                                            className="bg-blue-500 py-2 px-6 w-full mt-10 text-white font-bold rounded-lg hover:cursor-pointer 
                                            hover:transition-colors hover:bg-blue-600 md:w-auto flex justify-start items-center gap-x-2"
                                        >
                                            <EyeIcon className="h-6"/>
                                            Publicar
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

export default PostModal