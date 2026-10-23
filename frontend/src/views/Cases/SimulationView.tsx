import MedicalHistoryOptions from "../../components/simulation/MedicalHistoryOptions";
import { ArrowUpRightIcon } from "@heroicons/react/16/solid";
import Experience from "../../SimulationExperiences/PatientExperience/Experience";
import { useEffect, useRef, useState } from "react";
import { useAppStore } from "../../stores/useAppStore";
import { useParams } from "react-router-dom";

const SimulationView = () => {
    //Usamos useRef para hacer referencia a un elmento del HTML
    const canvasRef = useRef<HTMLCanvasElement>(null);

    //Tamanio de la simulacion
    let [ windowSize, setWindowSize ] = useState<boolean>( false );

    useEffect(() => {
        //Obtenemos el valor actual de la refenrencia
        const canvas = canvasRef.current;
        if( !canvas ) return;

        //Instanciamos la simulacion del paciente
        const patientExperience = new Experience( canvas );
    }, []);

    //Obtenemos la informacion del caso
    const params = useParams();
    const caseId = +params.id!;

    const fetchSimulation = useAppStore( state => state.fetchSimulation );
    const clinicalCase = useAppStore( state => state.case );

    useEffect(() => {
        const fetchData = async() => {
            await fetchSimulation( caseId );
        }
        fetchData();
    }, [ caseId, fetchSimulation ]);

  return (
    <>
        <h1 className="text-5xl text-center font-bold  my-10 text-blue-500">{ clinicalCase.title }</h1>
        
        <div className="grid grid-cols-2 gap-x-5 mb-5">

        <div className="relative w-full min-w-0 min-h-110 overflow-hidden rounded-xl">
            <div 
                className="absolute top-2 right-2 z-10 bg-white shadow rounded-xl p-1 h-8 w-8 cursor-pointer"
                onClick={ () =>  setWindowSize(prevValue => !prevValue) }
            >
                <ArrowUpRightIcon className="text-gray-400" />
            </div>

            <canvas
                ref={canvasRef}
                id="caseSimulation-webgl"
                className="w-full h-full"
            />
        </div>

            <div className="bg-white shadow rounded-xl p-5 max-w-full h-fit max-h-full">
                <p className="text-gray-500 font-bold">Descripcion:</p>
                <p>
                    {clinicalCase.description}
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