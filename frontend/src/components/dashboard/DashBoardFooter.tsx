
const DashBoardFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-800 p-7 transition-colors duration-300 dark:bg-slate-900">
      <div className="relative z-10 mx-auto flex max-w-screen-2xl flex-col items-center justify-center gap-3 text-center">
        <a
          href="/"
          className="text-2xl font-extrabold tracking-[0.2em] text-white transition hover:text-sky-600 dark:text-cyan-300 dark:hover:text-cyan-200"
        >
          CLIRA
        </a>

        <div className="h-px w-20 bg-sky-300 dark:bg-cyan-800" />

        <p className="text-sm font-medium text-white dark:text-slate-400">
          Todos los derechos reservados © {currentYear}
        </p>

        <p className="text-xs tracking-wide text-white dark:text-cyan-700">
          Simulación clínica y aprendizaje médico
        </p>
      </div>
    </footer>
  );
};

export default DashBoardFooter;
