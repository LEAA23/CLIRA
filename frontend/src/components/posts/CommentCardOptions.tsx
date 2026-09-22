import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import {  EllipsisVerticalIcon, PencilIcon, TrashIcon } from '@heroicons/react/16/solid';
import { useNavigate } from 'react-router-dom';

type CommentCardOptionsProps = {
    id: number;
    post_id: number;
}

const CommentCardOptions = ( { post_id, id } : CommentCardOptionsProps ) => {
    const navigate = useNavigate();
    
  return (
    <>
        <Menu>
            <MenuButton className="text-gray-400 hover:text-gray-500 cursor-pointer">
                <EllipsisVerticalIcon className='h-6 aspect-square'/>
            </MenuButton>
            <MenuItems 
                anchor="bottom"
                className="bg-white p-5 rounded-xl shadow-2xl space-y-5"
            >
                
                <MenuItem>
                    <div 
                        className='flex justify-start gap-x-2 text-gray-400 hover:text-amber-400 cursor-pointer transition-all ease-in-out
                        duration-200'
                        onClick={ () => navigate( location.pathname + "?EditCommentModal=true&viewPost=true" + `&post=${post_id}` + `&Comment=${ id }` ) }
                    >
                        <PencilIcon className='h-6'/>
                        <button 
                            type='button'
                            className="block cursor-pointer"
                        >
                            Editar comentario
                        </button>
                    </div>
                </MenuItem>  
                <MenuItem>
                    <div 
                        className='flex justify-start gap-x-2 text-gray-400 hover:text-red-400 cursor-pointer transition-all ease-in-out
                        duration-200'
                        onClick={ () => navigate( location.pathname + "?DeleteCommentModal=true&viewPost=true" + `&post=${ post_id }` + `&Comment=${ id }` ) }
                    >
                        <TrashIcon className='h-6'/>
                        <button 
                            type='button'
                            className="block cursor-pointer"
                        >
                            Eliminar comentario
                        </button>
                    </div>
                </MenuItem> 
                
            </MenuItems>
        </Menu>
    </>
  )
}

export default CommentCardOptions;