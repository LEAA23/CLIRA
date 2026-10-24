import MenuResponsive from "./MenuResponsive";

const DashBoardHeader = () => {
  return (
    <header className="bg-blue-600 p-7 transition-colors duration-300 dark:bg-slate-900">
      <div className="flex flex-col items-center justify-between space-x-2 space-y-5 md:flex-row md:space-x-0 md:space-y-0">
        <a href="/">
          <h3 className="text-center text-4xl font-bold uppercase text-white">
            CLIRA
          </h3>
        </a>

        <div className="md:hidden">
          <MenuResponsive dahsboardOptions={true} />
        </div>

        <button
          type="button"
          className="hidden w-full rounded-lg bg-white px-6 py-2 text-center font-bold text-blue-500 transition hover:bg-slate-100 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-white md:block md:w-auto"
        >
          Cerrar Sesión
        </button>
      </div>
    </header>
  );
};

export default DashBoardHeader;
