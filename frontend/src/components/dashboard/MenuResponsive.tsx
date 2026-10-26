import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Bars3Icon, UserCircleIcon, ArrowRightStartOnRectangleIcon, PresentationChartLineIcon, HeartIcon, RocketLaunchIcon, RectangleGroupIcon, TrophyIcon, Cog6ToothIcon } from '@heroicons/react/16/solid';
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../stores/useAppStore";

type MenuResponsiveProps = {
  dahsboardOptions: boolean;
}

const MenuResponsive = ({dahsboardOptions} : MenuResponsiveProps) => {
  const navigate = useNavigate();
  const logout = useAppStore((state) => state.logout);
  const handleLogout = () => {
    logout();
    navigate("/auth/login", { replace: true });
  };
  return (
    <Menu>
      <MenuButton>
        <Bars3Icon  className="w-2/3 rounded-2xl bg-white p-5 text-center shadow-2xl focus:outline-none dark:border dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"/>
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
                href="/"
              >
                <PresentationChartLineIcon className=' h-8 aspect-square mr-2'/>
                Dashboard
              </a>
            </MenuItem>
            <MenuItem>
              <a 
                className="data-focus:bg-blue-100 flex justify-start items-center hover:border-l-4 
                hover:border-l-blue-500 py-2 px-1 hover:font-bold text-gray-500 hover:rounded-sm" 
                href="/clinical-cases"
              >
                <HeartIcon className=' h-8 aspect-square mr-2'/>
                Casos Clinicos
              </a>
            </MenuItem>
            <MenuItem>
              <a 
                className="data-focus:bg-blue-100 flex justify-start items-center hover:border-l-4 
                hover:border-l-blue-500 py-2 px-1 hover:font-bold text-gray-500 hover:rounded-sm" 
                href="/progress"
              >
                <RocketLaunchIcon className=' h-8 aspect-square mr-2'/>
                Mi Progreso
              </a>
            </MenuItem>
            <MenuItem>
              <a 
                className="data-focus:bg-blue-100 flex justify-start items-center hover:border-l-4 
                hover:border-l-blue-500 py-2 px-1 hover:font-bold text-gray-500 hover:rounded-sm" 
                href="/groups"
              >
                <RectangleGroupIcon className=' h-8 aspect-square mr-2'/>
                Mis Grupos
              </a>
            </MenuItem>
            <MenuItem>
              <a 
                className="data-focus:bg-blue-100 flex justify-start items-center hover:border-l-4 
                hover:border-l-blue-500 py-2 px-1 hover:font-bold text-gray-500 hover:rounded-sm" 
                href="/ranking"
              >
                <TrophyIcon className=' h-8 aspect-square mr-2'/>
                Ranking
              </a>
            </MenuItem>
            <MenuItem>
              <a 
                className="data-focus:bg-blue-100 flex justify-start items-center hover:border-l-4 
                hover:border-l-blue-500 py-2 px-1 hover:font-bold text-gray-500 hover:rounded-sm" 
                href="/settings"
              >
                <Cog6ToothIcon className=' h-8 aspect-square mr-2'/>
                Confiuraci&oacute;n             
              </a>
            </MenuItem>
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
              <button 
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center rounded-sm px-2 py-2 text-left text-gray-700 hover:border-l-4 hover:border-l-blue-500 hover:bg-blue-100 hover:font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-slate-100 dark:hover:bg-slate-700"
              >
                <ArrowRightStartOnRectangleIcon className= "mr-2 h-8 aspect-square" />
                Cerrar sesi&oacute;n
              </button>
            </MenuItem>

      </MenuItems>
    </Menu>
  )
}

export default MenuResponsive