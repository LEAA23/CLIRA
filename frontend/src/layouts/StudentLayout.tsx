import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import DashBoardHeader from "../components/dashboard/DashBoardHeader";
import DashBoardFooter from "../components/dashboard/DashBoardFooter";
import DashBoardSidebar from "../components/dashboard/DashBoardSidebar";
import { ToastContainer } from "react-toastify";

const StudentLayout = () => {
  useEffect(() => {
    try {
      const storedPreferences = localStorage.getItem("CLIRA_PREFERENCES");

      if (storedPreferences) {
        const preferences = JSON.parse(storedPreferences);

        document.documentElement.classList.toggle(
          "dark",
          preferences.darkMode === true
        );
      }
    } catch (error) {
      console.error("No se pudieron cargar las preferencias:", error);
    }
  }, []);

  const location = useLocation()
  const show = location.pathname.includes("simulation")? false: true;

  return (
    <>
      <DashBoardHeader/>
      <main className="flex h-screen">
        <DashBoardSidebar
          show={show}
        />
        <section className="container mx-auto px-10 pb-10 flex flex-col overflow-y-scroll">
          <Outlet/>
        </section>
      </main>
      <DashBoardFooter/>

      <ToastContainer
        pauseOnFocusLoss={false}
        pauseOnHover={false}
      />
    </>
  );
};

export default StudentLayout;
