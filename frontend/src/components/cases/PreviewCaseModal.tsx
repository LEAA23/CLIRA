import { Dialog, Transition } from '@headlessui/react';
import { ChartBarIcon, StarIcon, CursorArrowRaysIcon, CalendarDaysIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/16/solid';
import { useNavigate } from 'react-router-dom';
import { Fragment } from 'react/jsx-runtime';
import { useShowModal } from '../../hooks/useShowModal';

type PreviewCaseModalProps = {
    started: boolean;
}

const PreviewCaseModal = ({started} : PreviewCaseModalProps) => {
    const navigate = useNavigate();

    const showModal = useShowModal("previewCase");
  return (
    <>
        <Transition appear show={showModal} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => navigate(location.pathname, { replace: true })}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/60" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-5/6 max-w-5xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-16">
                                <Dialog.Title
                                    as="h3"
                                    className="font-black text-4xl my-2 text-center"
                                >
                                    {"Titulo del caso clinico"}
                                </Dialog.Title>
                                <div className='grid grid-cols-1 lg:grid-cols-2'>
                                    <div 
                                        className="relative w-full  aspect-square overflow-hidden rounded-lg mx-auto"
                                    >
                                        <img loading="lazy" src="/patientExample.png" alt="Imagen simulacion numero x" className="w-full aspect-square" />
                                        <div className="absolute bottom-0 left-0 w-full h-20 bg-linear-to-t from-white to-transparent"></div>
                                    </div>

                                    <div className='flex flex-col ml-5'>
                                        <div className="border-l-4 border-blue-500 pl-5 my-2 text-xl">
                                            <p className='font-bold text-gray-500 mb-2'>Descripcion:</p>
                                            <span className="text-black font-normal">
                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam quis quam placerat, 
                                                luctus elit non, vehicula dui. Aliquam efficitur ipsum vitae sapien faucibus blandit. 
                                                Maecenas scelerisque diam eget neque placerat tempor non nec enim. Fusce in suscipit diam. 
                                                Proin rutrum aliquam nunc et fringilla. Nam dapibus pretium aliquam. Ut fringilla 
                                                ullamcorper urna id mattis. Nam sodales varius facilisis. Ut volutpat facilisis magna, 
                                                nec bibendum dui malesuada id. 
                                            </span>
                                        </div>

                                        <div className="my-5 border-l-4 border-blue-400 pl-5">
                                            <p className="text-gray-500 font-bold text-xl mb-2">Filtros:</p>
                                            <div className="flex justify-start flex-wrap gap-2">
                                                <p className="border border-blue-500 text-blue-500 hover:bg-blue-500 hover:border-white hover:text-white px-2 py-1 rounded-lg">Adulto</p>
                                                <p className="border border-blue-500 text-blue-500 hover:bg-blue-500 hover:border-white hover:text-white px-2 py-1 rounded-lg">Cabeza</p>
                                                <p className="border border-blue-500 text-blue-500 hover:bg-blue-500 hover:border-white hover:text-white px-2 py-1 rounded-lg">Hereditarias</p>
                                                <p className="border border-blue-500 text-blue-500 hover:bg-blue-500 hover:border-white hover:text-white px-2 py-1 rounded-lg">Fiebre</p>
                                                <p className="border border-blue-500 text-blue-500 hover:bg-blue-500 hover:border-white hover:text-white px-2 py-1 rounded-lg">Fiebre</p>
                                            </div>
                                        </div>

                                    </div>        

                                    <div className="my-5 border-l-4 border-blue-300 pl-5 ml-5 lg:col-span-2 ">
                                        <p className="text-gray-500 font-bold text-xl mb-2">Estadisticas:</p>

                                        <div className="flex flex-wrap gap-5">
                                            <div className="flex justify-start items-end gap-x-2">
                                                <div className="bg-green-400 rounded-lg w-8 p-1 aspect-square text-white font-bold"><ChartBarIcon/></div>
                                                <p className="font-semibold">Dificultad fac&iacute;l</p>
                                            </div>

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
                                                <div className="bg-gray-300 rounded-4xl w-8 p-1 text-white font-bold"><CursorArrowRaysIcon/></div>
                                                <p className="font-semibold">{"5"} Intentos</p>
                                            </div>

                                            <div className="flex justify-start items-end gap-x-2">
                                                <div className="bg-yellow-300 rounded-lg w-8 p-1 aspect-square text-white font-bold"><StarIcon/></div>
                                                <p className="font-semibold">Calificaci&oacute;n {"100"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {started && (
                                        <div className="my-5 border-l-4 border-blue-200 pl-5 ml-5 lg:col-span-2 ">
                                            <p className="text-gray-500 font-bold text-xl mb-2">Diagnostico final:</p>
                                            <p className='text-black font-normal'>nedkwnedw ed ewdweid wd wediuwe duwe idwd.dbdbd wqdui qwidwq diqwd qdw</p>

                                        </div>
                                    )}
        
                                </div>
                                <div className='flex flex-col md:flex-row justify-center gap-x-10'>
                                    
                                    <button
                                        type="button"
                                        onClick={() => navigate(location.pathname, { replace: true })}
                                        className="bg-red-400 py-2 px-6 w-full block mt-10 text-white font-bold rounded-lg hover:cursor-pointer 
                                        hover:transition-colors hover:bg-red-500 md:w-auto"
                                    >
                                        Salir
                                    </button> 

                                    <button
                                        type="button"
                                        className="bg-blue-500 py-2 px-6 w-full block mt-10 text-white font-bold rounded-lg hover:cursor-pointer 
                                        hover:transition-colors hover:bg-blue-600 md:w-auto"
                                        onClick={() => {
                                            navigate(`/simulation/${"12"}`)
                                        }}
                                    >
                                        
                                        {started? "Continuar" : "Comenzar"}
                                    </button>  
                                </div>
                                
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    </>
  )
}

export default PreviewCaseModal;