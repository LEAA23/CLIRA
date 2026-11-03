import { Transition, Dialog } from "@headlessui/react";
import { Fragment } from "react/jsx-runtime";
import { useShowModal } from "../../hooks/useShowModal";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import ErrorMessage from "../ErrorMessage";
import { ArrowRightStartOnRectangleIcon, ArrowUpTrayIcon, BeakerIcon, HeartIcon, PlusIcon } from "@heroicons/react/16/solid";
import { useEffect, useState } from "react";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { toast } from "react-toastify";
import { useAppStore } from "../../stores/useAppStore";
import type { CreateCaseForm, LaboratoryStudies } from "../../types";

const CreateCaseModal = () => {
    const showModal = useShowModal( "CreateCase" );

    const navigate = useNavigate();

    const getLaboratoryStudies = useAppStore( state => state.getLaboratorystudies );
    const createCase = useAppStore( state => state.createCase );

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<CreateCaseForm>();

    const [ selectedFile, setSelectedFile ] = useState<File | null>(null);
    const [ selectedModel, setSelectedModel ]= useState<File | null>(null);
    let caseImageURL = selectedFile? URL.createObjectURL( selectedFile ) : null;
    let modelInfo = selectedModel? selectedModel.name : null;

    
    type FilterCategory = "extremidad" | "paciente" | "dificultad";
    
    const [selectedFilters, setSelectedFilters] = useState<number[]>([]);
    
    const filterOptions: Record< FilterCategory, { id: number; label: string }[] > = {
        extremidad: [
            { id: 3, label: "Cabeza" },
            { id: 4, label: "Pulmones" },
        ],
        paciente: [
            { id: 5, label: "Adulto" },
            { id: 6, label: "Menor" },
        ],
        dificultad: [
            { id: 7, label: "Fácil" },
            { id: 8, label: "Media" },
            { id: 9, label: "Difícil" },
        ],
    };

    const handleFilterChange = (category: FilterCategory, id: number) => {
        setSelectedFilters((prev) => {
            const categoryIds = filterOptions[category].map((option) => option.id);

            // Si el filtro ya está seleccionado, lo deseleccionamos.
            if (prev.includes(id)) {
                return prev.filter((filterId) => filterId !== id);
            }

            // Extremidad permite seleccionar múltiples opciones.
            if (category === "extremidad") {
                return [...prev, id];
            }

            // Paciente y dificultad solo permiten una opción.
            // Al elegir otra, se reemplaza la selección anterior de esa categoría.
            return [
                ...prev.filter((filterId) => !categoryIds.includes(filterId)),
                id,
            ];
        });
    };

    const handleSubmitCase = async( formData : CreateCaseForm ) => {

        // Validar registros clínicos
        const invalidRecords = records.some(
            record => !record.type.trim() || !record.content.trim()
        );

        if (invalidRecords) {
            toast.error("Todos los registros clínicos deben tener un contenido");
            return;
        }

        const data = new FormData();
        data.append("title", formData.title);
        data.append("description", formData.description);
        data.append("height", String(formData.height) );
        data.append("weight", String(formData.weight) );
        data.append("bloodPreassure", String(formData.bloodPreassure) );
        data.append("filters", JSON.stringify(selectedFilters));
        data.append("symptomsAndHistory", JSON.stringify( records ));

        if(laboratoryResults.length > 0) {
            data.append("laboratoryStudies", JSON.stringify( laboratoryResults ) );
        }
        if(selectedFile) {
            data.append("previewImage", selectedFile);
        }
        if(selectedModel) {
            data.append("simulationModel", selectedModel);
        }

        try {
            const message = await createCase( data );
            toast.success( message );

            navigate( location.pathname, { replace: true } );

            setValue("title", "");
            setValue("description", "");
            setSelectedFile(null);
            setSelectedModel(null);
            setSelectedFilters([]);
            setLaboratoryResults([]);
        } catch (error) {
            if( error instanceof Error ) {
                toast.error( error.message );
            }
        }
    }

    //Sintomas
    interface CaseRecordInput {
        type: string;
        content: string;
    }

    const [records, setRecords] = useState<CaseRecordInput[]>([
        { type: "symptom", content: "" }
    ]);

    const addRecord = () => {
        setRecords(prev => [
            ...prev,
            { type: "symptom", content: "" }
        ]);
    };

    const removeRecord = (index: number) => {
        setRecords(prev => prev.filter((_, i) => i !== index));
    };

    const updateRecord = (
        index: number,
        field: keyof CaseRecordInput,
        value: string
    ) => {
        setRecords(prev =>
            prev.map((record, i) =>
                i === index
                    ? { ...record, [field]: value }
                    : record
            )
        );
    };

    //Estudios de laboratorio

    interface LaboratoryResult {
        id: number;
        value: number;
    }

    useEffect(() => {
        const fetchLaboratoryStudies = async () => {
            try {
                const laboratoryStudies = await getLaboratoryStudies();
                if(laboratoryStudies) {
                    setLaboratoryStudies( laboratoryStudies );
                }
            } catch (error) {
                console.error("Error al obtener los estudios:", error);
            }
        };

        fetchLaboratoryStudies();
    }, []);

    const [laboratoryStudies, setLaboratoryStudies] = useState<LaboratoryStudies>([]);
    const [laboratoryResults, setLaboratoryResults] = useState<LaboratoryResult[]>([]);

    const addLaboratoryResult = () => {
        setLaboratoryResults(prev => [
            ...prev,
            { id: 0, value: 0 }
        ]);
    };

    const removeLaboratoryResult = (index: number) => {
        setLaboratoryResults(prev =>
            prev.filter((_, i) => i !== index)
        );
    };

    const updateLaboratoryResult = (
        index: number,
        field: keyof LaboratoryResult,
        value: number | string
    ) => {
        setLaboratoryResults(prev =>
            prev.map((result, i) =>
                i === index
                    ? { ...result, [field]: value }
                    : result
            )
        );
    };

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
                            <Dialog.Panel className="w-5/6 max-w-5xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-10">
                                <Dialog.Title
                                    as="h3"
                                    className="font-black text-4xl my-2 text-center"
                                >
                                    Crear Nuevo Caso Clinico
                                </Dialog.Title>


                                <div className="p-5 max-w-full mt-5">
                                    <form
                                        onSubmit={ handleSubmit(handleSubmitCase) }
                                    >

                                        <div className="flex flex-col">
                                            <label 
                                                htmlFor="title"
                                                className="text-gray-600 font-bold text-xl"
                                            >Titulo</label>
                                            <input 
                                                id="title"
                                                type="text"
                                                placeholder="Escribe el titulo del caso aqui"
                                                className="border border-gray-400 p-2 my-3 w-full rounded-lg"
                                                {...register("title", {
                                                    required: "El titulo del caso es obligatorio"
                                                })}
                                            />
                                            {errors.title && (
                                                <ErrorMessage>{ String(errors.title.message) }</ErrorMessage>
                                            )}
                                        </div>

                                        <div className="flex flex-col">
                                            <label 
                                                htmlFor="description"
                                                className="text-gray-600 font-bold text-xl"
                                            >Descripci&oacute;n del caso</label>
                                            <textarea 
                                                id="description"
                                                className="border border-gray-400 p-2 my-3 w-full rounded-lg"
                                                {...register("description", {
                                                    required: "La descripcion del caso es obligatorio"
                                                })}
                                            ></textarea>
                                            {errors.description && (
                                                <ErrorMessage>{ String(errors.description.message) }</ErrorMessage>
                                            )}
                                        </div>

                                        <div className="my-5 flex flex-col">
                                            <label
                                                className="text-gray-600 font-bold text-xl"
                                            >
                                                Registros clinicos del paciente
                                            </label>

                                            {records.map((record, index) => (
                                                <div key={index}>
                                                    <p className="text-gray-500">
                                                        Registro clinico {index + 1}
                                                    </p>

                                                    <div className="flex justify-start items-center gap-2">
                                                        <select
                                                            value={record.type}
                                                            onChange={e =>
                                                                updateRecord(index, "type", e.target.value)
                                                            }
                                                            className="bg-blue-500 px-3 py-2 rounded-lg text-white font-semibold cursor-pointer"
                                                        >
                                                            <option value="symptom">Síntoma</option>
                                                            <option value="history">Antecedente médico</option>
                                                            <option value="age">Edad</option>
                                                        </select>

                                                        <input
                                                            value={record.content}
                                                            onChange={e =>
                                                                updateRecord(index, "content", e.target.value)
                                                            }
                                                            className="border border-gray-400 p-2 my-3 rounded-lg"
                                                        />

                                                        <button 
                                                            onClick={() => removeRecord(index)}
                                                            type="button"
                                                            className="px-3 py-2 bg-red-400 hover:bg-red-500 cursor-pointer text-white font-bold rounded-lg"
                                                        >
                                                            Eliminar
                                                        </button>

                                                    </div>

                                                </div>
                                            ))}

                                            <button 
                                                onClick={addRecord}
                                                type="button"
                                                className="bg-purple-500 py-2 px-6 text-white font-bold rounded-lg mt-3 
                                                hover:cursor-pointer hover:transition-colors hover:bg-purple-600 w-full flex 
                                                justify-center items-center gap-x-2"                                            >
                                                <HeartIcon className="h-6 aspect-square"
                                            />
                                                Agregar registro clinico
                                            </button>
                                        </div>
                                        
                                        <div className="my-5 flex flex-col">
                                            <p className="text-gray-600 font-bold text-xl">
                                                Metricas corporales del paciente
                                            </p>

                                            <div>
                                                <label htmlFor="height" className="text-gray-500">
                                                    Altura
                                                </label>
                                                <input 
                                                    id="height"
                                                    type="number"
                                                    {...register("height")}
                                                    min="100"
                                                    max="300"
                                                    placeholder="Ingresa la altura del paciente en cm"
                                                    className="border border-gray-400 p-2 mb-3 w-full rounded-lg"
                                                />

                                            </div>

                                            <div>
                                                <label htmlFor="weight" className="text-gray-500">
                                                    Peso
                                                </label>
                                                <input 
                                                    id="weight"
                                                    type="number"
                                                    {...register("weight")}
                                                    min="1"
                                                    max="300"
                                                    placeholder="Ingresa el peso del paciente en kg"
                                                    className="border border-gray-400 p-2 mb-3 w-full rounded-lg"
                                                />

                                            </div>

                                            <div>
                                                <label htmlFor="bloodPreassure" className="text-gray-500">
                                                    Presi&oacute;n Sanguinea
                                                </label>
                                                <input 
                                                    id="bloodPreassure"
                                                    type="text"
                                                    {...register("bloodPreassure")}
                                                    placeholder="Ingresa la presion sanguinea del paciente, Ej. 120/80"
                                                    className="border border-gray-400 p-2 mb-3 w-full rounded-lg"
                                                />

                                            </div>
                                        </div>
                            
                                        <div className="my-5 flex flex-col">
                                            <label className="text-gray-600 font-bold text-xl">
                                                Estudios de laboratorio
                                            </label>

                                            {laboratoryResults.map((result, index) => (
                                                <div key={index}>
                                                    <p className="text-gray-500">
                                                        Estudio de laboratorio {index + 1}
                                                    </p>

                                                    <div className="flex flex-wrap justify-start items-center gap-2">

                                                        <select
                                                            value={result.id}
                                                            onChange={e =>
                                                                updateLaboratoryResult(
                                                                    index,
                                                                    "id",
                                                                    Number(e.target.value)
                                                                )
                                                            }
                                                            className="bg-blue-500 px-3 py-2 rounded-lg text-white font-semibold cursor-pointer"
                                                        >
                                                            <option defaultChecked disabled value={0}> Selecciona un estudio </option>

                                                            {laboratoryStudies.map(study => (
                                                                <option
                                                                    key={study.id}
                                                                    value={study.id}
                                                                    disabled={laboratoryResults.some(
                                                                        (item, i) =>
                                                                            i !== index &&
                                                                            item.id === study.id
                                                                    )}
                                                                >
                                                                    {study.name}
                                                                </option>
                                                            ))}
                                                        </select>

                                                        <input
                                                            type="number"
                                                            step="any"
                                                            value={result.value}
                                                            onChange={e =>
                                                                updateLaboratoryResult(
                                                                    index,
                                                                    "value",
                                                                    Number(e.target.value)
                                                                )
                                                            }
                                                            placeholder="Resultado"
                                                            className="border border-gray-400 p-2 my-3 rounded-lg"
                                                        />

                                                        <button
                                                            onClick={() => removeLaboratoryResult(index)}
                                                            type="button"
                                                            className="px-3 py-2 bg-red-400 hover:bg-red-500 cursor-pointer text-white font-bold rounded-lg"
                                                        >
                                                            Eliminar
                                                        </button>

                                                    </div>
                                                </div>
                                            ))}

                                            <button
                                                onClick={addLaboratoryResult}
                                                type="button"
                                                className="bg-purple-500 py-2 px-6 text-white font-bold rounded-lg mt-3
                                                hover:cursor-pointer hover:transition-colors hover:bg-purple-600 w-full flex
                                                justify-center items-center gap-x-2"
                                            >
                                                <BeakerIcon className="h-6 aspect-square"/>
                                                Agregar estudio de laboratorio
                                            </button>
                                        </div>

                                        <div className="flex flex-col">
                                            <label 
                                                htmlFor="previewImage"
                                                className="text-gray-600 font-bold text-xl"
                                            >Imagen del caso</label>
                                            <input 
                                                id="previewImage"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                {...register("previewImage", {
                                                    onChange: e => {
                                                        const file = e.target.files[0];
                                                        setSelectedFile( file );
                                                    }
                                                })}
                                            />
                                            <label 
                                                htmlFor="previewImage"
                                                className="bg-purple-500 py-2 px-6 text-white font-bold rounded-lg mt-10 md:mt-5 
                                                hover:cursor-pointer hover:transition-colors hover:bg-purple-600 w-full flex 
                                                justify-center items-center gap-x-2"
                                            >
                                                <ArrowUpTrayIcon className="h-6"/>
                                                Seleccionar imagen
                                            </label>
                                            {errors.previewImage && (
                                                <ErrorMessage>{ String(errors.previewImage.message) }</ErrorMessage>
                                            )}

                                            <div className="mt-5 items-center">
                                                {caseImageURL && (
                                                    <>
                                                        <div className="relative inline-block w-fit">
                                                            <img 
                                                                src={ caseImageURL } 
                                                                alt="Vista previa de imagen de caso"
                                                                className="h-40" 
                                                            />
                                                            <div 
                                                                className="absolute -top-2 -right-5 bg-red-400 h-8 aspect-square rounded-full
                                                                            hover:bg-red-500 cursor-pointer p-1"
                                                                onClick={ () => setSelectedFile(null) }
                                                            >
                                                                <p className="font-bold text-white text-center">X</p>
                                                            </div>

                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                            
                                        </div>

                                        <div className="flex flex-col mt-5">
                                            <label 
                                                htmlFor="simulationModel"
                                                className="text-gray-600 font-bold text-xl"
                                            >Modelo 3D</label>
                                            <input 
                                                id="simulationModel"
                                                type="file"
                                                accept=".glb,model/gltf-binary"
                                                className="hidden"
                                                {...register("simulationModel", {
                                                    onChange: e => {
                                                        const file = e.target.files[0];
                                                        setSelectedModel( file );
                                                    }
                                                })}
                                            />
                                            <label 
                                                htmlFor="simulationModel"
                                                className="bg-purple-500 py-2 px-6 text-white font-bold rounded-lg mt-10 md:mt-5 
                                                hover:cursor-pointer hover:transition-colors hover:bg-purple-600 w-full flex 
                                                justify-center items-center gap-x-2"
                                            >
                                                <ArrowUpTrayIcon className="h-6"/>
                                                Seleccionar modelo 3D (extension .glb)
                                            </label>
                                            {errors.simulationModel && (
                                                <ErrorMessage>{ String(errors.simulationModel.message) }</ErrorMessage>
                                            )}
                                            {modelInfo && (
                                                <div className="mt-5">
                                                    <p className="text-sm text-gray-600 font-semibold mb-5">Modelo seleccionado:</p>
                                                    <div className="relative bg-gray-500 px-3 py-1 rounded-lg text-white font-semibold inline-block">
                                                        <p>{modelInfo}</p>
                                                        <div 
                                                            className="absolute -top-2 -right-5 bg-red-400 h-8 aspect-square rounded-full
                                                                        hover:bg-red-500 cursor-pointer p-1"
                                                            onClick={ () => setSelectedModel(null) }
                                                        >
                                                            <p className="font-bold text-white text-center">X</p>
                                                        </div>

                                                    </div>
                                                </div>
                                            )}
                                            
                                        </div>

                                        <div className="flex flex-col mt-5">
                                            <label 
                                                htmlFor="filters"
                                                className="text-gray-600 font-bold text-xl"
                                            >Filtros</label>
                                                                                        
                                            <div className="flex justify-start flex-wrap gap-5 mt-5">
                                                {/* Extremidad */}
                                                <Popover>
                                                    <PopoverButton className="block text-sm/6 font-bold text-gray-400 focus:outline-none data-active:text-blue-500 data-hover:text-blue-500">
                                                        Extremidad
                                                        {filterOptions.extremidad.filter((option) =>
                                                            selectedFilters.includes(option.id)
                                                        ).length > 0 &&
                                                            ` (${filterOptions.extremidad.filter((option) =>
                                                                selectedFilters.includes(option.id)
                                                            ).length})`}
                                                    </PopoverButton>

                                                    <PopoverPanel
                                                        transition
                                                        anchor="bottom"
                                                        className="rounded-xl bg-white border border-blue-500 mt-5 shadow-2xl text-sm/6 transition duration-200 ease-in-out data-closed:-translate-y-1 data-closed:opacity-0"
                                                    >
                                                        <div className="p-3 min-w-48 space-y-3">
                                                            {filterOptions.extremidad.map((option) => (
                                                                <label
                                                                    key={option.id}
                                                                    className="flex items-center gap-2 cursor-pointer text-gray-700"
                                                                >
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={selectedFilters.includes(option.id)}
                                                                        onChange={() =>
                                                                            handleFilterChange("extremidad", option.id)
                                                                        }
                                                                        className="accent-blue-500"
                                                                    />
                                                                    {option.label}
                                                                </label>
                                                            ))}
                                                        </div>
                                                    </PopoverPanel>
                                                </Popover>

                                                {/* Paciente */}
                                                <Popover>
                                                    <PopoverButton className="block text-sm/6 font-bold text-gray-400 focus:outline-none data-active:text-blue-500 data-hover:text-blue-500">
                                                        Paciente
                                                        {filterOptions.paciente.find((option) =>
                                                            selectedFilters.includes(option.id)
                                                        )?.label && (
                                                            ` (${filterOptions.paciente.find((option) =>
                                                                selectedFilters.includes(option.id)
                                                            )?.label})`
                                                        )}
                                                    </PopoverButton>

                                                    <PopoverPanel
                                                        transition
                                                        anchor="bottom"
                                                        className="rounded-xl bg-white border border-blue-500 mt-5 shadow-2xl text-sm/6 transition duration-200 ease-in-out data-closed:-translate-y-1 data-closed:opacity-0"
                                                    >
                                                        <div className="p-3 min-w-48 space-y-3">
                                                            {filterOptions.paciente.map((option) => (
                                                                <label
                                                                    key={option.id}
                                                                    className="flex items-center gap-2 cursor-pointer text-gray-700"
                                                                >
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={selectedFilters.includes(option.id)}
                                                                        onChange={() =>
                                                                            handleFilterChange("paciente", option.id)
                                                                        }
                                                                        className="accent-blue-500"
                                                                    />
                                                                    {option.label}
                                                                </label>
                                                            ))}
                                                        </div>
                                                    </PopoverPanel>
                                                </Popover>

                                                {/* Dificultad */}
                                                <Popover>
                                                    <PopoverButton className="block text-sm/6 font-bold text-gray-400 focus:outline-none data-active:text-blue-500 data-hover:text-blue-500">
                                                        Dificultad
                                                        {filterOptions.dificultad.find((option) =>
                                                            selectedFilters.includes(option.id)
                                                        )?.label && (
                                                            ` (${filterOptions.dificultad.find((option) =>
                                                                selectedFilters.includes(option.id)
                                                            )?.label})`
                                                        )}
                                                    </PopoverButton>

                                                    <PopoverPanel
                                                        transition
                                                        anchor="bottom"
                                                        className="rounded-xl bg-white border border-blue-500 mt-5 shadow-2xl text-sm/6 transition duration-200 ease-in-out data-closed:-translate-y-1 data-closed:opacity-0"
                                                    >
                                                        <div className="p-3 min-w-48 space-y-3">
                                                            {filterOptions.dificultad.map((option) => (
                                                                <label
                                                                    key={option.id}
                                                                    className="flex items-center gap-2 cursor-pointer text-gray-700"
                                                                >
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={selectedFilters.includes(option.id)}
                                                                        onChange={() =>
                                                                            handleFilterChange("dificultad", option.id)
                                                                        }
                                                                        className="accent-blue-500"
                                                                    />
                                                                    {option.label}
                                                                </label>
                                                            ))}
                                                        </div>
                                                    </PopoverPanel>
                                                </Popover>

                                            </div>
                                        </div>

                                        {selectedFilters && (
                                            <div className="flex justify-start flex-wrap space-x-3 mt-3">
                                                {selectedFilters.map((id) => {
                                                    const filter = Object.values(filterOptions).flat().find((option) => option.id === id);
                                                    if (!filter) return null;

                                                    return (
                                                        <div
                                                            key={id}
                                                            className="flex items-center border border-blue-500 text-blue-500 hover:bg-blue-500 hover:border-white hover:text-white px-2 py-1 rounded-lg"
                                                        >
                                                            <span>{filter.label}</span>

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setSelectedFilters((prev) =>
                                                                        prev.filter((filterId) => filterId !== id)
                                                                    )
                                                                }
                                                                className="font-bold hover:text-red-200 cursor-pointer ml-2"
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        <div className='flex flex-col md:flex-row mt-5 justify-center gap-x-10'>
                                    
                                            <button
                                                type="button"
                                                onClick={() => navigate(location.pathname, { replace: true })}
                                                className="bg-red-400 py-2 px-6 w-full mt-5 text-white font-bold rounded-lg hover:cursor-pointer 
                                                hover:transition-colors hover:bg-red-500 md:w-auto flex md:justify-start justify-center items-center gap-x-2"
                                            >
                                                <ArrowRightStartOnRectangleIcon className="h-6"/>
                                                Salir
                                            </button> 

                                            <button
                                                type="submit"
                                                className="bg-blue-500 py-2 px-6 w-full mt-5 text-white font-bold rounded-lg hover:cursor-pointer 
                                                hover:transition-colors hover:bg-blue-600 md:w-auto flex md:justify-start justify-center items-center gap-x-2"
                                            >
                                                <PlusIcon className="h-6"/>
                                                Crear Caso
                                            </button>  
                                        </div>
                                    </form>

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

export default CreateCaseModal;