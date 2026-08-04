import MenuResponsive from "./MenuResponsive";

const DashBoardHeader = () => {
  return (

    <header className="bg-blue-600 p-7">
      <div className="flex flex-col items-center space-y-5 space-x-2 justify-between md:flex-row md:space-y-0 md:space-x-0">

        <a href="/">
          <h3 className="text-white font-bold text-4xl text-center uppercase">Clira</h3>
        </a>

        <div className="md:hidden">
          <MenuResponsive
            dahsboardOptions={true}
          />
        </div>
        <button type="button" className="hidden md:block bg-white text-blue-500 font-bold py-2 px-6 rounded-lg text-center w-full md:w-auto">Cerrar Sesión</button>

      </div>
    </header>

  )
} 

export default DashBoardHeader;