import { useEffect } from "react";
import { Outlet } from "react-router-dom";
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      <DashBoardHeader />

      <main className="flex min-h-screen">
        <DashBoardSidebar />

        <section className="container mx-auto flex min-w-0 flex-1 flex-col overflow-y-auto bg-slate-50 px-4 pb-10 dark:bg-slate-950 md:px-10">
          <Outlet />
        </section>
      </main>

      <DashBoardFooter />

      <ToastContainer
        pauseOnFocusLoss={false}
        pauseOnHover={false}
      />
    </div>
  );
};

export default StudentLayout;
