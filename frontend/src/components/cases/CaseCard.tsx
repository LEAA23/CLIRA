import { CalendarDaysIcon, ChartBarIcon, CheckCircleIcon, ClockIcon, CursorArrowRaysIcon, StarIcon } from "@heroicons/react/16/solid";
import { useNavigate } from "react-router-dom";
import type { Filter } from "../../types";

type CaseCardProps = {
    id: number;
    title: string;
    description: string;
    previewImage: string;
    filters: Filter[];
    started: boolean;
}

const CaseCard = ( { id, title, description, previewImage, filters, started } : CaseCardProps ) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(location.pathname + "?previewCase=true");
    }
  return (
    <div 
        className="bg-white p-5 max-w-full rounded-2xl shadow space-y-5 
        hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between"
        onClick={() => handleClick()}
    >
        <h3 className="text-center text-gray-500 font-bold text-2xl">{ title }</h3>

        <div className="relative w-full overflow-hidden rounded-lg">
            <div className="h-60 overflow-hidden rounded-lg">
                <img src={ previewImage } alt="Sample image" className="w-full rounded-lg" />
            </div>
            
            <div className="absolute bottom-0 left-0 w-full h-20 bg-linear-to-t from-white to-transparent"></div>
        </div>

        <div>
            <p className="text-gray-500 font-semibold mb-1">Descripci&oacute;n:</p>
            <p className="line-clamp-4">
                { description } 

            </p>
        </div>

        <div className="py-1">
            <p className="text-gray-500 font-semibold">Filtros:</p>
            <div className="flex justify-start flex-wrap gap-2">
                {
                    filters.map( filterSelected => (
                        <p className="border border-blue-500 text-blue-500 hover:bg-blue-500 hover:border-white hover:text-white px-2 py-1 rounded-lg">{ filterSelected.name }</p>

                    ) )
                }
            </div>
        </div>

        <div className="flex flex-col space-y-3">
            {started && (
                <>
                    <div className="flex justify-start items-end gap-x-2">
                        <div className="bg-green-400 rounded-4xl w-8 aspect-square p-1 text-white font-bold"><CheckCircleIcon/></div>
                        <p className="font-semibold">Caso completado</p>
                    </div>
                    <div className="flex justify-start items-end gap-x-2">
                        <div className="bg-violet-400 rounded-4xl w-8 aspect-square p-1 text-white font-bold"><CalendarDaysIcon/></div>
                        <p className="font-semibold">Ultimo intento hace: 2 dias</p>
                    </div>
                    <div className="flex justify-start items-end gap-x-2">
                        <div className="bg-blue-400 rounded-4xl w-8 aspect-square p-1 text-white font-bold"><ClockIcon/></div>
                        <p className="font-semibold">Tiempo empleado: 20 min.</p>
                    </div>    
                </>
            )}

            <div className="flex justify-start items-end gap-x-2">
                <div className="bg-green-400 rounded-lg w-8 p-1 aspect-square text-white font-bold"><ChartBarIcon/></div>
                <p className="font-semibold">Dificultad fac&iacute;l</p>
            </div>

            <div className="flex justify-start items-end gap-x-2">
                <div className="bg-gray-300 rounded-4xl w-8 p-1 text-white font-bold"><CursorArrowRaysIcon/></div>
                <p className="font-semibold">{"5"} Intentos</p>
            </div>

            <div className="flex justify-start items-end gap-x-2">
                <div className="bg-yellow-300 rounded-lg w-8 p-1 aspect-square text-white font-bold"><StarIcon/></div>
                <p className="font-semibold">Calificaci&oacute;n {"100"}</p>
            </div>
        </div>

        {started && (
            <div className="">
                <p className="text-gray-500 font-semibold">Diagnostico final:</p>
                <p>sdnaksdnkajndkajsdnasd sdbsdbd sd sdf...</p>
            </div>
        )}

        <button
            type="button"
            className="bg-blue-500 py-2 px-6 w-full block mx-auto text-white font-bold rounded-lg hover:cursor-pointer 
            hover:transition-colors hover:bg-blue-600 md:w-auto"
            onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/simulation/${ id }`);
                }
            }
        >
            {started? "Continuar" : "Comenzar"}
        </button>
    </div>

  )
}

export default CaseCard;