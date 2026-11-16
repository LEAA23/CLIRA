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
      <div className="flex flex-col items-center space-y-5 space-x-2 justify-between md:flex-row md:space-y-0 md:space-x-0">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="text-white font-bold text-4xl text-center uppercase cursor-pointer"
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
            className="hidden md:block bg-white hover:bg-gray-100 text-blue-500 hover:text-blue-600 font-bold py-2 px-6 rounded-lg text-center w-full md:w-auto cursor-pointer"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashBoardHeader;