import { NavLink, Link } from "react-router-dom";
import MenuResponsive from "./dashboard/MenuResponsive";

const Header = () => {
  const linkStyles = ({ isActive }: { isActive: boolean }) =>
    `relative whitespace-nowrap py-2 text-sm lg:text-base font-medium transition-all duration-300
    after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:bg-white
    after:rounded-full after:transition-all after:duration-300
    ${
      isActive
        ? "text-white after:w-full"
        : "text-blue-100 hover:text-white after:w-0 hover:after:w-full"
    }`;

  return (
    <header className="relative z-20 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 shadow-lg">
      <div className="mx-auto flex w-full items-center justify-between px-6 py-5 lg:px-10">

        {/* LOGO A LA IZQUIERDA */}
        <Link to="/" className="shrink-0">
          <h3 className="text-3xl font-extrabold uppercase tracking-wider text-white">
            Clira<span className="text-cyan-200">.</span>
          </h3>
        </Link>

        {/* MENÚ MÓVIL */}
        <div className="md:hidden ml-auto">
          <MenuResponsive dahsboardOptions={false} />
        </div>

        {/* TODOS LOS ENLACES A LA DERECHA */}
        <nav className="hidden md:flex ml-auto items-center justify-end gap-8 lg:gap-10">
          <NavLink to="/" end className={linkStyles}>
            Inicio
          </NavLink>

          <NavLink to="/auth/sobre-nosotros" className={linkStyles}>
            Sobre nosotros
          </NavLink>

          <NavLink to="/auth/contactanos" className={linkStyles}>
            Contáctanos
          </NavLink>

          <NavLink to="/catalogo" className={linkStyles}>
            Cursos y Catálogo
          </NavLink>
        </nav>

      </div>
    </header>
  );
};

export default Header;