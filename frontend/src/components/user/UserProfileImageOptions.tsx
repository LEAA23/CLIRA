import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { PencilIcon, TrashIcon } from "@heroicons/react/16/solid";
import { useNavigate } from "react-router-dom";

const UserProfileImageOptions = () => {
    const navigate = useNavigate();

  return (
    <>
        <Menu>
            <MenuButton className="text-gray-400 hover:text-white cursor-pointer">
                <PencilIcon className='h-6 aspect-square'/>
            </MenuButton>
            <MenuItems 
                anchor="left"
                className="bg-white p-5 rounded-xl shadow-2xl space-y-5"
            >
                
                <MenuItem>
                    <div 
                        className='flex justify-start gap-x-2 text-gray-400 hover:text-amber-400 cursor-pointer transition-all ease-in-out
                        duration-200'
                        onClick={ () => navigate( location.pathname + `?EditImage=true`) }
                    >
                        <PencilIcon className='h-6'/>
                        <button 
                            type='button'
                            className="block cursor-pointer"
                        >
                            Cambiar imagen
                        </button>
                    </div>
                </MenuItem>  
                <MenuItem>
                    <div 
                        className='flex justify-start gap-x-2 text-gray-400 hover:text-red-400 cursor-pointer transition-all ease-in-out
                        duration-200'
                        onClick={ () => navigate( location.pathname + `?DeleteImage=true` ) }
                    >
                        <TrashIcon className='h-6'/>
                        <button 
                            type='button'
                            className="block cursor-pointer"
                        >
                            Eliminar imagen
                        </button>
                    </div>
                </MenuItem> 
                
            </MenuItems>
        </Menu>
    </>
  )
}

export default UserProfileImageOptions;