import { Transition, Dialog } from "@headlessui/react";
import { Fragment } from "react/jsx-runtime";
import { useShowModal } from "../../hooks/useShowModal";
import { useLocation, useNavigate } from "react-router-dom";
import { MinusIcon, PlusIcon } from "@heroicons/react/16/solid";
import { useState } from "react";
import type { MemberOptionType } from "../../types";
import SearchBar from "../SearchBar";

const MembersModal = () => {
    const navigate = useNavigate();
    const showModal = useShowModal( "MembersModal" );

    const location = useLocation();
    const queryParams = new URLSearchParams( location.search );
    const groupId = queryParams.get("Group");

    const actions : MemberOptionType[] = [
        { id: "addMember", label: "Agregar miembro" },
        { id: "removeMemer", label: "Remover miembro" }
    ];

    const [ selected, setSelected ] = useState<string>( "addMember" );

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
                                    Miembros del grupo
                                </Dialog.Title>

                                <div className="flex justify-start items-center gap-5 mt-5 p-5 pb-0 max-w-full">
                                    {actions.map( action => (
                                        <button
                                            id={action.id}
                                            onClick={ () => setSelected( action.id ) }
                                            className={`${ selected === action.id? 
                                                "text-blue-500 font-semibold border-b-4 border-blue-500" : "text-gray-400" }
                                                flex justify-center items-center gap-x-2 pb-1 cursor-pointer transition-all ease-in-out duration-200`
                                            }
                                        >
                                            { action.id === "addMember"? (
                                                <PlusIcon className="h-6"/>
                                            ): (
                                                <MinusIcon className="h-6"/>
                                            ) }

                                            { action.label }
                                        </button>
                                    ) )}
                                </div>

                                <div className="p-5 max-w-full">
                                    <SearchBar
                                        pendingCases={false}
                                        filters={false}
                                        inputType="email"
                                        placeholder="Busca el usuario escribiendo su correo electronico"
                                    />

                                    <div>
                                        <p className="text-gray-600 font-bold text-xl">Miembros actuales:</p>
                                    </div>

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

export default MembersModal;