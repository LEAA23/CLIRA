import { Transition, Dialog } from "@headlessui/react";
import { ArrowUpTrayIcon, EyeIcon, XMarkIcon } from "@heroicons/react/16/solid";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import ErrorMessage from "../ErrorMessage";
import type { EditCaseForm } from "../../types";
import { toast } from "react-toastify";
import { useAppStore } from "../../stores/useAppStore";
import { useEffect, useState } from "react";

const EditCaseModal = () => {
    //useNavigate para redireccionar al usuario a la misma pagina pero sin los query params
    const navigate = useNavigate();

    //Extraemos el queryParam de editCase para verificar si se debe o no mostar el modal para editar el post
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const editCase = queryParams.get("EditCase");
    const showModal = editCase? true: false;

    const params = useParams();
    const caseId = +params.case!;

    const fetchCase = useAppStore( state => state.fetchCase );
    const clinicalCase = useAppStore( state => state.case )

    const initialValues : EditCaseForm = {
        title: "",
        description: "",
        previewImage: null,
        simulationModel: null
    }
    
    const { register, formState: { errors }, reset, watch, setValue, handleSubmit } = useForm<EditCaseForm>( {defaultValues: initialValues } );
    
    useEffect(() => {
        fetchCase( caseId );
    }, []);
    
    useEffect(() => {
        if(clinicalCase) {
            setValue("title", clinicalCase.title);
            setValue("description", clinicalCase.description);
            setValue("simulationModel", clinicalCase.simulationModel);
        }
    }, [ clinicalCase, reset ]);
    
    
    //Construimos una URL temporal para poder renderizarla en el componnete cuando el usuario seleccione una imagen
    const previewImage = watch("previewImage");
    const [imageURL, setImageURL] = useState<string | null>(null);

    useEffect(() => {
        if (!previewImage) {
            setImageURL(null);
            return;
        }

        const url = URL.createObjectURL(previewImage as File);
        setImageURL(url);

        return () => {
            URL.revokeObjectURL(url);
        };
    }, [previewImage]);

    const [ selectedModel, setSelectedModel ]= useState<File | null>(null);
    let modelInfo = selectedModel? selectedModel.name : null;


    //Filtros
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

    useEffect(() => {
        if (clinicalCase?.filters) {
            setSelectedFilters(
                clinicalCase.filters.map((filter) => filter.id)
            );
        }
    }, [clinicalCase]);

    const handleFilterChange = (
        category: FilterCategory,
        id: number
    ) => {
        setSelectedFilters((prev) => {
            const categoryIds = filterOptions[category].map(
                (option) => option.id
            );

            // Si ya está seleccionado, lo eliminamos.
            if (prev.includes(id)) {
                return prev.filter((filterId) => filterId !== id);
            }

            // Extremidad permite múltiples opciones.
            if (category === "extremidad") {
                return [...prev, id];
            }

            // Paciente y dificultad permiten una sola opción.
            return [
                ...prev.filter(
                    (filterId) => !categoryIds.includes(filterId)
                ),
                id,
            ];
        });
    };

    const handleDeleteCaseImage = async(  caseId: number ) => {
        try {
            const message = ""
            toast.success( message );
        } catch (error) {
            if( error instanceof Error ) {
                toast.error( error.message );
            }
        }
    }

    const handleUpdateCase = async( formData: EditCaseForm ) => {
        const data = new FormData();
        data.append("title", formData.title);
        data.append("description", formData.description);
        data.append("filters", JSON.stringify(selectedFilters));

        if(formData.previewImage instanceof File) {
            data.append("caseImage", formData.previewImage);
        }

        if(selectedModel) {
            data.append("simulationModel", selectedModel);
        }

        try {
            const message = ""
            toast.success( message );
            navigate( location.pathname, { replace: true } );
        } catch (error) {
            if ( error instanceof Error ) {
                toast.error( error.message );
            }
        }
    }

  if(clinicalCase) return (
    <>
        <Transition appear show={showModal} as={Fragment}>
            <Dialog as="div" className="relative z-10" 
                onClose={() => {
                    navigate(location.pathname, { replace: true });
                }}
            >
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
                            <Dialog.Panel className="w-5/6 max-w-5xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-3 lg:p-10">
                                <Dialog.Title
                                    as="h3"
                                    className="font-black text-4xl my-2 text-center"
                                >
                                    Editar Caso Clinico
                                </Dialog.Title>

                                            
                                <form
                                    className="space-y-2 p-5"
                                    onSubmit={ handleSubmit( handleUpdateCase ) }
                                >
                                    <div className="flex flex-col">
                                        <label 
                                            htmlFor="title"
                                            className="text-gray-600 text-2xl font-bold"
                                        >Titulo</label>
                                        <input 
                                            type="text" 
                                            id="title"
                                            placeholder="Escribe el titulo del caso clinico aqui"
                                            className="border border-gray-400 p-2 my-3 w-full rounded-lg"
                                            {...register("title", {
                                                required: "El titulo es obligatorio"
                                            })}
                                        />
                                    </div>
                                    {errors.title && (
                                        <ErrorMessage>{ String(errors.title.message) }</ErrorMessage>
                                    )}

                                    <div className="flex flex-col">
                                        <label 
                                            htmlFor="description"
                                            className="text-gray-600 text-2xl font-bold"
                                        >Descripcion</label>
                                        <textarea 
                                            id="description"
                                            className="border border-gray-400 p-2 my-3 w-full rounded-lg h-30"
                                            {...register("description", {
                                                required: "El contenido es obligatorio"
                                            })}
                                        ></textarea>
                                    </div>
                                    {errors.description && (
                                        <ErrorMessage>{ String( errors.description.message ) }</ErrorMessage>
                                    )}

                                    <div className="flex flex-col justify-between space-x-5">
                                        <label 
                                            htmlFor="previewImage"
                                            className="text-gray-600 text-2xl font-bold"
                                        >Imagenes</label>
                                        
                                        {clinicalCase.previewImage && (
                                            <div className="mt-5">
                                                <p className="text-sm text-gray-600 font-semibold mb-5">Imagenes previamente seleccionadas:</p>

                                                <div className="flex justify-start space-x-5 space-y-5 items-center flex-wrap">
                                                        <div className="relative">
                                                            <img 
                                                                key={ clinicalCase.previewImage.toString() }
                                                                src={ clinicalCase.previewImage.toString() } 
                                                                alt="Vista previa de imagen de fondo"
                                                                className="h-36" 
                                                            />

                                                            <div 
                                                                className="absolute top-1 right-1 bg-red-400 h-8 aspect-square rounded-full
                                                                            hover:bg-red-500 cursor-pointer p-1"
                                                                onClick={ () => handleDeleteCaseImage( clinicalCase.id ) }
                                                            >
                                                                <p className="font-bold text-white text-center">X</p>
                                                            </div>

                                                        </div>

                                                </div>
                                            </div>
                                        )}

                                        <input
                                            id="previewImage"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];

                                                    if (file) {
                                                        setValue("previewImage", file, {
                                                            shouldValidate: true,
                                                            shouldDirty: true,
                                                        });
                                                    }
                                                }}
                                        />
                                        <label 
                                            htmlFor="previewImage"
                                            className="bg-purple-500 py-2 px-6 text-white font-bold rounded-lg mt-10 md:mt-5 
                                            hover:cursor-pointer hover:transition-colors hover:bg-purple-600 w-full flex 
                                            justify-center items-center gap-x-2"
                                        >
                                            <ArrowUpTrayIcon className="h-6"/>
                                            Seleccionar nueva imagen
                                        </label>

                                        {imageURL && (
                                            <div className="mt-5">
                                                <p className="text-sm text-gray-600 font-semibold mb-5">Nueva imagen seleccionada:</p>

                                                <div className="flex justify-start space-x-5 space-y-5 items-center flex-wrap">
                                                    <div className="relative">
                                                        <img 
                                                            key={imageURL}
                                                            src={ imageURL } 
                                                            alt="Vista previa de imagen de fondo"
                                                            className="h-36" 
                                                        />

                                                        <div 
                                                            className="absolute top-1 right-1 bg-red-400 h-8 aspect-square rounded-full
                                                                        hover:bg-red-500 cursor-pointer p-1"
                                                            onClick={ () => {
                                                                setValue("previewImage", null, {
                                                                    shouldDirty: true,
                                                                });
                                                            } }
                                                        >
                                                            <p className="font-bold text-white text-center">X</p>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        )}

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

                                        {clinicalCase.simulationModel && (
                                            <div className="mt-5">
                                                <p className="text-sm text-gray-600 font-semibold mb-5">Modelo seleccionado:</p>
                                                <div className="relative bg-gray-500 px-3 py-1 rounded-lg text-white font-semibold inline-block">
                                                    <p>{clinicalCase.simulationModel.toString().split("-")[1]}</p>
                                                    <div 
                                                        className="absolute -top-2 -right-5 bg-red-400 h-8 aspect-square rounded-full
                                                                    hover:bg-red-500 cursor-pointer p-1"
                                                        onClick={ () => 0}
                                                    >
                                                        <p className="font-bold text-white text-center">X</p>
                                                    </div>

                                                </div>
                                            </div>
                                        )}
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
                                                <PopoverButton className="font-bold text-gray-500 hover:text-blue-500">
                                                    Extremidad
                                                    {filterOptions.extremidad.filter((option) =>
                                                        selectedFilters.includes(option.id)
                                                    ).length > 0 &&
                                                        ` (${
                                                            filterOptions.extremidad.filter((option) =>
                                                                selectedFilters.includes(option.id)
                                                            ).length
                                                        })`}
                                                </PopoverButton>

                                                <PopoverPanel
                                                    anchor="bottom"
                                                    className="rounded-xl bg-white border border-blue-500 mt-3 shadow-xl"
                                                >
                                                    <div className="p-3 min-w-48 space-y-3">
                                                        {filterOptions.extremidad.map((option) => (
                                                            <label
                                                                key={option.id}
                                                                className="flex items-center gap-2 cursor-pointer"
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
                                                <PopoverButton className="font-bold text-gray-500 hover:text-blue-500">
                                                    Paciente
                                                    {filterOptions.paciente.filter((option) =>
                                                        selectedFilters.includes(option.id)
                                                    ).length > 0 &&
                                                        ` (${
                                                            filterOptions.paciente.filter((option) =>
                                                                selectedFilters.includes(option.id)
                                                            ).length
                                                        })`}
                                                </PopoverButton>

                                                <PopoverPanel
                                                    anchor="bottom"
                                                    className="rounded-xl bg-white border border-blue-500 mt-3 shadow-xl"
                                                >
                                                    <div className="p-3 min-w-48 space-y-3">
                                                        {filterOptions.paciente.map((option) => (
                                                            <label
                                                                key={option.id}
                                                                className="flex items-center gap-2 cursor-pointer"
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
                                                <PopoverButton className="font-bold text-gray-500 hover:text-blue-500">
                                                    Dificultad
                                                    {filterOptions.dificultad.filter((option) =>
                                                        selectedFilters.includes(option.id)
                                                    ).length > 0 &&
                                                        ` (${
                                                            filterOptions.dificultad.filter((option) =>
                                                                selectedFilters.includes(option.id)
                                                            ).length
                                                        })`}
                                                </PopoverButton>

                                                <PopoverPanel
                                                    anchor="bottom"
                                                    className="rounded-xl bg-white border border-blue-500 mt-3 shadow-xl"
                                                >
                                                    <div className="p-3 min-w-48 space-y-3">
                                                        {filterOptions.dificultad.map((option) => (
                                                            <label
                                                                key={option.id}
                                                                className="flex items-center gap-2 cursor-pointer"
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

                                    <div className="flex flex-wrap gap-3 mt-4">
                                        {selectedFilters.map((id) => {
                                            const filter = Object.values(filterOptions)
                                                .flat()
                                                .find((option) => option.id === id);

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
                                                        aria-label={`Eliminar filtro ${filter.label}`}
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className='flex flex-col md:flex-row justify-center gap-x-10 mt-10 lg:mt-0'>
                                    
                                        <button
                                            type="button"
                                            onClick={() => {
                                                navigate(location.pathname, { replace: true });
                                            }}
                                            className="bg-red-400 py-2 px-6 w-full mb-3 lg:mb-0 lg:mt-10 text-white font-bold rounded-lg hover:cursor-pointer 
                                            hover:transition-colors hover:bg-red-500 md:w-auto flex justify-center md:justify-start items-center gap-x-2"
                                        >
                                            <XMarkIcon className="h-6"/>
                                            Cancelar
                                        </button> 

                                        <button
                                            type="submit"
                                            className="bg-blue-500 py-2 px-6 w-full mb-3 lg:mb-0 lg:mt-10 text-white font-bold rounded-lg hover:cursor-pointer 
                                            hover:transition-colors hover:bg-blue-600 md:w-auto flex justify-center md:justify-start items-center gap-x-2"
                                        >
                                            <EyeIcon className="h-6"/>
                                            Publicar
                                        </button>  
                                    </div>
                                </form>
                               

                                
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>

    </>
  )
}

export default EditCaseModal;