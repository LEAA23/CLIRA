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
      <div className="relative z-10 flex w-full items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex shrink-0 items-center gap-3 text-3xl font-extrabold tracking-wider text-white transition hover:scale-[1.02] dark:text-cyan-300 md:text-4xl"
        >
          CLIRA
        </button>

        <div className="flex items-center gap-3">
          <div className="md:hidden">
            <MenuResponsive dahsboardOptions={true} />
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="hidden rounded-xl border border-sky-200 bg-white/90 px-5 py-2.5 font-semibold text-sky-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-sky-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-sky-400 dark:border-cyan-800 dark:bg-slate-900/80 dark:text-cyan-200 dark:hover:bg-slate-800 md:block"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashBoardHeader;