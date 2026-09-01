import { Transition, Dialog } from "@headlessui/react";
import { Fragment } from "react/jsx-runtime";
import { useShowModal } from "../../hooks/useShowModal";
import { useLocation, useNavigate } from "react-router-dom";
import { MinusIcon, PlusIcon } from "@heroicons/react/16/solid";
import { useEffect, useState } from "react";
import type { MemberOptionType, UserSearched, UserSearchForm } from "../../types";
import SearchBar from "../SearchBar";
import { toast } from "react-toastify";
import { useAppStore } from "../../stores/useAppStore";
import ProfileTagName from "../posts/ProfileTagName";

const MembersModal = () => {
    const navigate = useNavigate();
    const showModal = useShowModal( "MembersModal" );

    const location = useLocation();
    const queryParams = new URLSearchParams( location.search );
    const groupId = Number( queryParams.get("Group") );

    const group = useAppStore( state => state.group );
    const fetchUser = useAppStore( state => state.fetchUser );
    const fetchDeleteUser = useAppStore( state => state.fetchUserDelete );
    const userSearched = useAppStore( state => state.userSearched );

    const addMembertoGroup = useAppStore( state => state.addMembertoGroup );
    const removeMemberFromGroup = useAppStore( state => state.removeMemberFromGroup );
    const cleanGroup = useAppStore( state => state.cleanGroup );
    const cleanUserSearched = useAppStore(  state => state.cleanUserSearched );
    
    //opciones para menu de agregar o eliminar miembro del grupo
    const [ selected, setSelected ] = useState<string>( "addMember" );

    //Se limpia el state de userSearched cada vez que se selecciona una opcion diferente
    useEffect(() => {
        cleanUserSearched();
    }, [selected]);

    //Opciones dispoinbles
    const actions : MemberOptionType[] = [
        { id: "addMember", label: "Agregar miembro" },
        { id: "removeMemer", label: "Remover miembro" }
    ];

    //Funcion para manejar una busqueda para agregar a los usuarios a un grupo
    const handleSearch = async( data: UserSearchForm ) => {
        try {
            const { email } = data;
            await fetchUser( email );
        } catch (error) {
            if( error instanceof Error ) {
                toast.error( error.message );
            }
        }
    }

    //Funcion de busqueda para buscar usuarios especificos de un grupo para eliminarlos
    const handleDeleteSearch = async( data: UserSearchForm ) => {
        try {
            const { email } = data;
            await fetchDeleteUser( { groupId, email } );
        } catch (error) {
            if( error instanceof Error ) {
                toast.error( error.message )
            }
        }
    }

    //Funcion para agregar a un usuario cuando se de click en el boton de agregar
    const handleClickAddMember = async() => {
        try {
            const message = await addMembertoGroup( { groupId, user: userSearched } );
            toast.success( message );
        } catch (error) {
            if( error instanceof Error ) {
                toast.error( error.message );
            }
        }
    }

    //Funcion para remover un usuario cuando se de click en el boton de eliminar
    const handleClickRemoveMember = async() => {
        try {
            const message = await removeMemberFromGroup( { groupId, user: userSearched } );
            toast.success( message );

        } catch (error) {
            if( error instanceof Error ) {
                toast.error( error.message );
            }
        }
    }

    //Funcion para eliminar dinamicamente a los usuarios actuales de un grupo mediante un click en el boton de eliminar
    const handleClickDynamicRemove = async( user : UserSearched ) => {
        try {
            const message = await removeMemberFromGroup( { groupId, user } );
            toast.success( message );
        } catch (error) {
            if( error instanceof Error ) {
                toast.error( error.message )
            }
        }
    }


  return (
    <>
        <Transition appear show={showModal} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => {
                navigate(location.pathname, { replace: true })
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
                                    Miembros del grupo
                                </Dialog.Title>

                                <div className="flex justify-start items-center gap-5 mt-5 p-5 pb-0 max-w-full">
                                    {actions.map( action => (
                                        <button
                                            key={action.id}
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

                                    {selected === "addMember"? (
                                        <SearchBar
                                            pendingCases={false}
                                            filters={false}
                                            inputType="email"
                                            inputName="email"
                                            placeholder="Busca al usuario escribiendo su correo electronico"
                                            fn={ handleSearch }
                                        />

                                    ) : (
                                        <SearchBar
                                            pendingCases={false}
                                            filters={false}
                                            inputType="email"
                                            inputName="email"
                                            placeholder="Busca al usuario escribiendo su correo electronico"
                                            fn={ handleDeleteSearch }
                                        />
                                    )}

                                    
                                    {userSearched.name !== "" && (

                                        <div className="mb-5">
                                            <p className="mb-5 text-gray-600 font-bold ">Resultados de la busqueda:</p>
                                            <div className="flex justify-start items-center gap-x-3">
                                                <ProfileTagName
                                                    name={userSearched.name}
                                                    lastName={userSearched.lastName}
                                                />

                                                {selected === "addMember"? (
                                                    <div 
                                                        className="rounded-full bg-blue-400 hover:bg-blue-500 transition-all 
                                                        duration-200 ease-in-out h-8 aspect-square text-center cursor-pointer"
                                                        onClick={ handleClickAddMember }
                                                    >
                                                        <p className="text-white font-bold text-xl">+</p>
                                                    </div>

                                                ) : (
                                                    <div 
                                                        className="rounded-full bg-red-400 hover:bg-red-500 transition-all 
                                                        duration-200 ease-in-out h-8 aspect-square text-center cursor-pointer"
                                                        onClick={ handleClickRemoveMember }
                                                    >
                                                        <p className="text-white font-bold text-xl">x</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                
                                    <div>
                                        <p className="text-gray-600 font-bold text-xl">
                                            Miembros actuales:
                                        </p>

                                        {selected === "addMember"? (
                                            <div className="mt-5 flex justify-start items-center gap-5 flex-wrap">
                                                {group.users.map( user => (
                                                    <ProfileTagName
                                                        key={user.id}
                                                        name={user.name}
                                                        lastName = {user.lastName}
                                                    />
                                                ) )}
                                            </div>

                                        ) : (
                                            <div className="mt-5 flex justify-start items-center gap-5 flex-wrap">
                                                {group.users.map( user => (
                                                    <div key={user.id} className="flex justify-between items-center gap-x-3">
                                                        <ProfileTagName
                                                            key={user.id}
                                                            name={user.name}
                                                            lastName = {user.lastName}
                                                        />

                                                        <div 
                                                            className="rounded-full bg-red-400 hover:bg-red-500 transition-all 
                                                            duration-200 ease-in-out h-8 aspect-square text-center cursor-pointer"
                                                            onClick={() => handleClickDynamicRemove(user) }
                                                            
                                                        >
                                                            <p className="text-white font-bold text-xl">x</p>
                                                        </div>
                                                    </div>
                                                ) )}
                                            </div>
                                        )}
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