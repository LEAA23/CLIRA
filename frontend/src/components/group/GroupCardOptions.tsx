import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ArrowRightStartOnRectangleIcon, EllipsisVerticalIcon } from '@heroicons/react/16/solid';

const GroupCardOptions = () => {
  return (
    <>
        <Menu>
            <MenuButton className="hover:text-blue-500 cursor-pointer">
                <EllipsisVerticalIcon className='h-6 aspect-square'/>
            </MenuButton>

            <MenuItems 
                anchor="bottom"
                className="bg-white p-5 rounded-xl shadow-2xl"
            >
                <MenuItem>
                    <div className='flex justify-start gap-x-2 hover:text-red-400'>
                        <ArrowRightStartOnRectangleIcon className='h-6'/>
                        <a className="block " href="/settings">
                            Salir del grupo
                        </a>
                        </div>
                </MenuItem>
            </MenuItems>
        </Menu>
    </>
  )
}

export default GroupCardOptions