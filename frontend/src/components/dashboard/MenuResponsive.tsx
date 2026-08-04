import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Bars3Icon, UserCircleIcon, ArrowRightStartOnRectangleIcon } from '@heroicons/react/16/solid';

type MenuResponsiveProps = {
  dahsboardOptions: boolean;
}

const MenuResponsive = ({dahsboardOptions} : MenuResponsiveProps) => {
  return (
    <Menu>
      <MenuButton>
        <Bars3Icon  className='text-white h-10 aspect-square cursor-pointer'/>
      </MenuButton>

      <MenuItems 
        anchor="bottom"
        className="bg-white shadow-2xl p-5 rounded-2xl text-center focus:outline-none w-2/3"
      
      >
        
        {dahsboardOptions? (
          <>
            <MenuItem>
              <a 
                className="data-focus:bg-blue-100 flex justify-start items-center hover:border-l-4 
                hover:border-l-blue-500 py-2 px-1 hover:font-bold text-gray-500 hover:rounded-sm" 
                href="/profile"
              >
                <UserCircleIcon className=' h-8 aspect-square mr-2'/>
                Perfil
              </a>
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem>
              <a 
                className="data-focus:bg-blue-100 flex justify-start items-center hover:border-l-4 
                hover:border-l-blue-500 py-2 px-1 hover:font-bold text-gray-500 hover:rounded-sm" 
                href="/profile"
              >
                <UserCircleIcon className=' h-8 aspect-square mr-2'/>
                Inicio
              </a>
            </MenuItem>

            <MenuItem>
              <a 
                className="data-focus:bg-blue-100 flex justify-start items-center hover:border-l-4 
                hover:border-l-blue-500 py-2 px-1 hover:font-bold text-gray-500 hover:rounded-sm" 
                href="/support"
              >
                <ArrowRightStartOnRectangleIcon className='h-8 aspect-square mr-2'/>
                Sobre nosotros
              </a>
            </MenuItem>
            <MenuItem>
              <a 
                className="data-focus:bg-blue-100 flex justify-start items-center hover:border-l-4 
                hover:border-l-blue-500 py-2 px-1 hover:font-bold text-gray-500 hover:rounded-sm" 
                href="/support"
              >
                <ArrowRightStartOnRectangleIcon className='h-8 aspect-square mr-2'/>
                Otra pagina
              </a>
            </MenuItem>
            <MenuItem>
              <a 
                className="data-focus:bg-blue-100 flex justify-start items-center hover:border-l-4 
                hover:border-l-blue-500 py-2 px-1 hover:font-bold text-gray-500 hover:rounded-sm" 
                href="/support"
              >
                <ArrowRightStartOnRectangleIcon className='h-8 aspect-square mr-2'/>
                Otra pagina
              </a>
            </MenuItem>
            <MenuItem>
              <a 
                className="data-focus:bg-blue-100 flex justify-start items-center hover:border-l-4 
                hover:border-l-blue-500 py-2 px-1 hover:font-bold text-gray-500 hover:rounded-sm" 
                href="/support"
              >
                <ArrowRightStartOnRectangleIcon className='h-8 aspect-square mr-2'/>
                Otra pagina
              </a>
            </MenuItem>
            <MenuItem>
              <a 
                className="data-focus:bg-blue-100 flex justify-start items-center hover:border-l-4 
                hover:border-l-blue-500 py-2 px-1 hover:font-bold text-gray-500 hover:rounded-sm" 
                href="/support"
              >
                <ArrowRightStartOnRectangleIcon className='h-8 aspect-square mr-2'/>
                Otra pagina
              </a>
            </MenuItem>
          </>
        )}

        <MenuItem>
          <a 
            className="data-focus:bg-blue-100 flex justify-start items-center hover:border-l-4 
            hover:border-l-blue-500 py-2 px-1 hover:font-bold text-gray-500 hover:rounded-sm" 
            href="/support"
          >
            <ArrowRightStartOnRectangleIcon className='h-8 aspect-square mr-2'/>
            Cerrar sesi&oacute;n
          </a>
        </MenuItem>

      </MenuItems>
    </Menu>
  )
}

export default MenuResponsive