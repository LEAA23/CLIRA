import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../stores/useAppStore";
import MenuResponsive from "./MenuResponsive";

const DashBoardHeader = () => {
  const navigate = useNavigate();
  const logout = useAppStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate("/auth/login", { replace: true });
  };

  return (
    <header className="bg-blue-600 p-7">
      <div className="flex flex-col items-center justify-between space-y-5 md:flex-row md:space-y-0">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="text-center text-4xl font-bold uppercase text-white"
        >
          Clira
        </button>

        <div className="md:hidden">
          <MenuResponsive dahsboardOptions={true} />
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="hidden w-full rounded-lg border border-white bg-white px-6 py-2 font-bold text-blue-700 transition-colors hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 dark:border-slate-500 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-700 md:block md:w-auto"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
};

export default DashBoardHeader;
