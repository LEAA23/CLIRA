import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ArrowRightStartOnRectangleIcon, EllipsisVerticalIcon, PencilIcon, TrashIcon } from '@heroicons/react/16/solid';
import { useAppStore } from '../../stores/useAppStore';
import { useNavigate } from 'react-router-dom';

type GroupCardOptionsProps = {
    id: number;
}

const GroupCardOptions = ( { id } : GroupCardOptionsProps ) => {
    const navigate = useNavigate();
    const user = useAppStore( state => state.user );
  return (
    <>
        <Menu>
            <MenuButton className="hover:text-blue-500 cursor-pointer">
                <EllipsisVerticalIcon className='h-6 aspect-square'/>
            </MenuButton>
            <MenuItems 
                anchor="bottom"
                className="bg-white p-5 rounded-xl shadow-2xl space-y-5"
            >
                {user.rol === "teacher"? (
                    <>
                        <MenuItem>
                            <div 
                                className='flex justify-start gap-x-2 hover:text-blue-400 cursor-pointer'
                                onClick={ () => navigate( location.pathname + "?EditGroupModal=true" + `&Group=${ id }` ) }
                            >
                                <PencilIcon className='h-6'/>
                                <button 
                                    type='button'
                                    className="block"
                                >
                                    Editar el grupo
                                </button>
                            </div>
                        </MenuItem>  
                        <MenuItem>
                            <div 
                                className='flex justify-start gap-x-2 hover:text-red-400 cursor-pointer'
                                onClick={ () => navigate( location.pathname + "?DeleteGroupModal=true" + `&Group=${ id }` ) }
                            >
                                <TrashIcon className='h-6'/>
                                <button 
                                    type='button'
                                    className="block"
                                >
                                    Eliminar el grupo
                                </button>
                            </div>
                        </MenuItem>         
                    </>

                ): (
                    <MenuItem>
                        <div className='flex justify-start gap-x-2 hover:text-red-400 cursor-pointer'>
                            <ArrowRightStartOnRectangleIcon className='h-6'/>
                            <a className="block " href="/settings">
                                Salir del grupo
                            </a>
                        </div>
                    </MenuItem>
                )}
            </MenuItems>
        </Menu>
    </>
  )
}

export default GroupCardOptions