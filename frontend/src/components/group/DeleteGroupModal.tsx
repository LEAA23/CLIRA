import { Transition, Dialog } from "@headlessui/react";
import { Fragment } from "react/jsx-runtime";
import { useShowModal } from "../../hooks/useShowModal";
import { useLocation, useNavigate } from "react-router-dom";
import { TrashIcon, XMarkIcon } from "@heroicons/react/16/solid";
import { useEffect } from "react";
import { useAppStore } from "../../stores/useAppStore";
import { toast } from "react-toastify";

const DeleteGroupModal = () => {
    
    const showModal = useShowModal( "DeleteGroupModal" );
    const location = useLocation();
    const queryParams = new URLSearchParams( location.search );
    const groupId = queryParams.get("Group");

    const fetchGroup = useAppStore( state => state.fetchGroup );
    const cleanGroup = useAppStore( state => state.cleanGroup );
    const deleteGroup = useAppStore( state => state.deleteGroup );
    const group = useAppStore( state => state.group );

    useEffect(() => {
        const getGroup = async() => {
            if(groupId) {
                await fetchGroup( Number( groupId ) );
            }
        }

        getGroup();
    }, [ groupId, fetchGroup ]);
    
    const navigate = useNavigate();

    const handleDeleteGroup = async( e: React.SubmitEvent<HTMLFormElement> ) => {
        e.preventDefault();
        try {
            const message = await deleteGroup( Number( groupId ) );
            toast.success( message );
            cleanGroup();
            navigate( location.pathname, { replace: true } );
        } catch (error) {
            if( error instanceof Error ) {
                toast.error(error.message)
            }
        }
    }
  return (
        <>
        <Transition appear show={showModal} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => {
                navigate(location.pathname, { replace: true });
                cleanGroup();
            }}>
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
                                    Eliminar Grupo
                                </Dialog.Title>

                                <div className="text-center mt-5 text-2xl">
                                    <p>&iquest;Estas seguro que quieres eliminar el grupo "{ group.name }"?</p>
                                </div>

                                <div className="max-w-full">
                                    <form
                                        onSubmit={ (e) => handleDeleteGroup(e) }
                                    >
                                        <input  id="groupId" name="groupId" type="hidden"/>

                                        <div className='flex flex-col md:flex-row mt-5 justify-center gap-x-10'>
                                    
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    navigate(location.pathname, { replace: true });
                                                    cleanGroup();
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

export default DeleteGroupModal