import { useLocation, NavLink, Link } from "react-router-dom";

const Header = () => {

  //Extaremos el pathname actual para saber si el usuario esta en la vista de login y asi mostrar/ocultar el boton de login
  const {pathname} = useLocation();
  console.log(pathname)

  return (

    <header className="bg-blue-600 p-7 mb-14">
      <div className="flex flex-col items-center space-y-5 space-x-2 justify-between md:flex-row md:space-y-0 md:space-x-0">

        <a href="/">
          <h3 className="text-white font-bold text-4xl text-center uppercase">Clira</h3>
        </a>

        <NavLink to="/" className={({isActive}) => isActive? "text-white font-medium" : "text-white font-light hover:font-medium"}>
          Inicio
        </NavLink>

        <NavLink to="#" className={({isActive}) => isActive? "text-white font-medium" : "text-white font-light hover:font-medium"}>
          Sobre nosotros
        </NavLink>

        <NavLink to="#" className={({isActive}) => isActive? "text-white font-medium" : "text-white font-light hover:font-medium"}>
          Otra pagina
        </NavLink>

        <NavLink to="#" className={({isActive}) => isActive? "text-white font-medium" : "text-white font-light hover:font-medium"}>
          Otra pagina
        </NavLink>

        <NavLink to="#" className={({isActive}) => isActive? "text-white font-medium" : "text-white font-light hover:font-medium"}>
          Otra pagina
        </NavLink>     
        
        <NavLink to="#" className={({isActive}) => isActive? "text-white font-medium" : "text-white font-light hover:font-medium"}>
          Otra pagina
        </NavLink>

        {pathname !== "/" && (
          <Link to="/auth/login" className="bg-white text-blue-500 font-bold py-2 px-6 rounded-lg text-center w-full md:w-auto">Iniciar Sesión</Link>
        )}
      </div>
    </header>

  )
} 

export default Header;