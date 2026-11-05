
import { useLayoutEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AuthBackground from "../components/auth/AuthBackground";
import { ToastContainer } from "react-toastify";

const AuthLayout = () => {

  const { pathname } = useLocation();

  // Mostrar el fondo únicamente en estas tres pantallas.
  const showAuthBackground = [
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password"
  ].includes(pathname);

  // Recuperar el tema guardado en CLIRA.
  useLayoutEffect(() => {

    try {

      const stored = localStorage.getItem(
        "CLIRA_PREFERENCES"
      );

      const preferences = stored
        ? JSON.parse(stored)
        : {};

      document.documentElement.classList.toggle(
        "dark",
        preferences.darkMode === true
      );

    } catch (error) {

      console.error(
        "No se pudieron recuperar las preferencias:",
        error
      );

      document.documentElement.classList.remove("dark");

    }

  }, []);

  return (
    <>

      {/* Fondo médico animado */}
      {showAuthBackground && <AuthBackground />}

      {/* Contenido original de CLIRA */}
      <div
        className={
          showAuthBackground
            ? "relative z-10"
            : undefined
        }
      >

        <Header />

        <main className="container mx-auto p-5">
          <Outlet />
        </main>

        <Footer />

      </div>

      <ToastContainer
        pauseOnFocusLoss={false}
        pauseOnHover={false}
      />

    </>
  );
};

export default AuthLayout;
