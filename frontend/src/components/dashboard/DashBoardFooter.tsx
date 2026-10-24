const DashBoardFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-800 p-7 transition-colors duration-300 dark:bg-slate-900">
      <div className="space-y-10">
        <a href="/">
          <h3 className="text-center text-3xl font-bold uppercase text-white">
            CLIRA
          </h3>
        </a>

        <p className="text-center font-light text-white">
          Todos los derechos reservados &copy;{currentYear}
        </p>
      </div>
    </footer>
  );
};

export default DashBoardFooter;
