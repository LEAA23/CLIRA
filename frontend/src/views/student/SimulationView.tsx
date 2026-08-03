import MedicalHistoryOptions from "../../components/simulation/MedicalHistoryOptions";
import { ArrowUpRightIcon } from "@heroicons/react/16/solid";

const SimulationView = () => {
  return (
    <>
        <h1 className="text-4xl text-center font-bold  my-10 text-blue-500">Titulo del Caso Medico</h1>
        
        <div className="grid grid-cols-2 gap-x-5 mb-5">
            <div className="bg-blue-200 relative">
                <div className="bg-white shadow rounded-xl p-1 h-8 aspect-square absolute right-0 hover:shadow-2xl 
                hover:-translate-y-1 cursor-pointer transition-all duration-200"
                >
                    <ArrowUpRightIcon className="text-gray-400"/>
                </div>
                <p>simulacion 3d aqui</p>
            </div>

            <div className="bg-white shadow rounded-2xl p-5 max-w-full">
                <p className="text-gray-500 font-bold">Descripcion:</p>
                <p>
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Maxime delectus voluptas impedit voluptate quis 
                    inventore in laboriosam id amet fuga praesentium, fugit possimus tempora dignissimos molestiae a eum 
                    recusandae blanditiis?.
                </p>
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias, voluptate. Rerum aliquam magni 
                    ccusantium inventore, veritatis nesciunt non sapiente animi soluta cumque quaerat unde atque quibusdam 
                    voluptatum, hic necessitatibus assumenda!
                </p>

                <form
                    className="flex justify-between items-center gap-x-5 mt-5"
                >
                    <input 
                        type="text"
                        className="border border-gray-400 p-2 my-3 w-full rounded-lg"
                        placeholder="Coloca tu diagnostico final aqui"
                    />
                    <input 
                        type="submit"
                        value="Diagnosticar"
                        className="bg-blue-500 py-2 px-6 w-full block mx-auto text-white font-bold rounded-lg hover:cursor-pointer 
                        hover:transition-colors hover:bg-blue-600 md:w-auto"
                    />
                </form>
            </div>
        </div>

        <div className="flex justify-between">
            <MedicalHistoryOptions/>
        </div>

        <div className="bg-white shadow rounded-2xl p-5 max-w-full mt-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
            <p className="text-gray-500 font-bold">Recursos disponibles:</p>
            <div className="flex justify-start gap-x-5 mt-5">

            </div>
        </div>
    </>
  )
}

export default SimulationView