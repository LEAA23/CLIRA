import { Transition, Dialog } from "@headlessui/react";
import { ArrowUpTrayIcon, EyeIcon, XMarkIcon } from "@heroicons/react/16/solid";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import ErrorMessage from "../ErrorMessage";
import type { PostEditForm } from "../../types";
import { toast } from "react-toastify";
import { useAppStore } from "../../stores/useAppStore";
import { useEffect, useState } from "react";
import EditCommentModal from "./EditCommentModal";
import DeleteCommentModal from "./DeleteCommentModal";

const EditPostModal = () => {
    //useNavigate para redireccionar al usuario a la misma pagina pero sin los query params
    const navigate = useNavigate();
    //Extraemos el queryParam de makePost para verificar si se debe o no mostar el modal para hacer una publicacion
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const makePost = queryParams.get("EditPost");
    const showModal = makePost? true: false;
    const postId = queryParams.get("post");

    const params = useParams();
    const groupId = params.id!;

    const fetchPost = useAppStore( state => state.fetchPost );
    const fetchPostImages = useAppStore( state => state.fetchPostImages );
    const post = useAppStore( state => state.post );
    const cleanPost = useAppStore( state => state.cleanPost );
    const deletePostImage = useAppStore( state => state.deletePostImage );
    const updatePost = useAppStore(state => state.updatePost );

    const initialValues : PostEditForm = {
        title: "",
        content: ""
    }
    
    //State local para permitirle a los usuarios seleccionar varias imagenes y mantener la seleccion
    const [ selectedImages, setSelectedImages ] = useState<File[]>([]);
    
    const { register, formState: { errors }, reset,  setValue, handleSubmit } = useForm<PostEditForm>( {defaultValues: initialValues } );
    
    useEffect(() => {
        if( postId ) {
            fetchPost( Number( postId ) );
            fetchPostImages( { groupId: +groupId, postId: +postId } )
        }
    }, [ fetchPost, fetchPostImages, postId ]);
    
    useEffect(() => {
        if( post ) {
            setValue("title", post.title);
            setValue("content", post.content);
        }
    }, [ post.id, reset ]);
    
    
    //Construimos una URL temporal para poder renderizarla en el componnete cuando el usuario seleccione una imagen
    const files = selectedImages;
    let mediaURLS = files? Array.from(files).map( file => URL.createObjectURL(file) ) : null; 

    const handleClick = ( index : number ) => {
        setSelectedImages( prev => prev.filter( (_, i) => i !== index ) );
    }

    const handleDeleteImage = async( imageId: number ) => {
        try {
            const message = await deletePostImage( { groupId: +groupId, postId: +postId!, imageId: imageId } );
            toast.success( message );
        } catch (error) {
            if( error instanceof Error ) {
                toast.error( error.message );
            }
        }
    }

    const handleUpdatePost = async( formData: PostEditForm ) => {
        const data = new FormData();
        data.append("title", formData.title);
        data.append("content", formData.content);

        //Iteramos sobre cada archivo en media y lo agregamos al campo de media
        selectedImages.forEach( image => {
            data.append("images", image);
        } );

        try {
            const message = await updatePost( { groupId: +groupId, postId: +postId!, formData: data } );
            toast.success( message );
            setSelectedImages([]);
            navigate( location.pathname, { replace: true } );
        } catch (error) {
            if ( error instanceof Error ) {
                toast.error( error.message );
            }
        }
    }

  return (
    <>
        <Transition appear show={showModal} as={Fragment}>
            <Dialog as="div" className="relative z-10" 
                onClose={() => {
                    navigate(location.pathname, { replace: true });
                    setSelectedImages([]);
                    cleanPost();
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
                            <Dialog.Panel className="w-5/6 max-w-5xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-16">
                                <Dialog.Title
                                    as="h3"
                                    className="font-black text-4xl my-2 text-center"
                                >
                                    Editar Publicacion
                                </Dialog.Title>

                                            
                                <form
                                    className="space-y-2 p-5"
                                    onSubmit={ handleSubmit( handleUpdatePost ) }
                                >
                                    <div className="flex flex-col">
                                        <label 
                                            htmlFor="title"
                                            className="text-gray-600 text-2xl font-bold"
                                        >Titulo</label>
                                        <input 
                                            type="text" 
                                            id="title"
                                            placeholder="Escribe el titulo de la publicacion aqui"
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
                                            htmlFor="content"
                                            className="text-gray-600 text-2xl font-bold"
                                        >Contenido</label>
                                        <textarea 
                                            id="content"
                                            className="border border-gray-400 p-2 my-3 w-full rounded-lg h-30"
                                            {...register("content", {
                                                required: "El contenido es obligatorio"
                                            })}
                                        ></textarea>
                                    </div>
                                    {errors.content && (
                                        <ErrorMessage>{ String( errors.content.message ) }</ErrorMessage>
                                    )}

                                    <div className="flex flex-col justify-between space-x-5">
                                        <label 
                                            htmlFor="images"
                                            className="text-gray-600 text-2xl font-bold"
                                        >Imagenes</label>
                                        
                                        {post.images.length > 0 && (
                                            <div className="mt-5">
                                                <p className="text-sm text-gray-600 font-semibold mb-5">Imagenes previamente seleccionadas:</p>

                                                <div className="flex justify-start space-x-5 space-y-5 items-center flex-wrap">
                                                    {post.images.map( image => (
                                                        <div className="relative">
                                                            <img 
                                                                key={ image.path }
                                                                src={ image.path } 
                                                                alt="Vista previa de imagen de fondo"
                                                                className="h-36" 
                                                            />

                                                            <div 
                                                                className="absolute top-1 right-1 bg-red-400 h-8 aspect-square rounded-full
                                                                            hover:bg-red-500 cursor-pointer p-1"
                                                                onClick={ () => handleDeleteImage( image.id ) }
                                                            >
                                                                <p className="font-bold text-white text-center">X</p>
                                                            </div>

                                                        </div>

                                                    ) )}
                                                </div>
                                            </div>
                                        )}

                                        <input
                                            id="images"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            name="images"
                                            onChange={(e) => {
                                                const files = Array.from(e.target.files ?? []);

                                                setSelectedImages(prev => [
                                                    ...prev,
                                                    ...files
                                                ]);
                                            }}
                                        />
                                        <label 
                                            htmlFor="images"
                                            className="bg-purple-500 py-2 px-6 text-white font-bold rounded-lg mt-10 md:mt-5 
                                            hover:cursor-pointer hover:transition-colors hover:bg-purple-600 w-full flex 
                                            justify-center items-center gap-x-2"
                                        >
                                            <ArrowUpTrayIcon className="h-6"/>
                                            Seleccionar m&aacute;s imagenes
                                        </label>

                                        {mediaURLS!.length > 0 && (
                                            <div className="mt-5">
                                                <p className="text-sm text-gray-600 font-semibold mb-5">Imagenes seleccionadas:</p>

                                                <div className="flex justify-start space-x-5 space-y-5 items-center flex-wrap">
                                                    {mediaURLS!.map( (mediaURL, index) => (
                                                        <div className="relative">
                                                            <img 
                                                                key={mediaURL}
                                                                src={ mediaURL } 
                                                                alt="Vista previa de imagen de fondo"
                                                                className="h-36" 
                                                            />

                                                            <div 
                                                                className="absolute top-1 right-1 bg-red-400 h-8 aspect-square rounded-full
                                                                            hover:bg-red-500 cursor-pointer p-1"
                                                                onClick={ () => handleClick( index ) }
                                                            >
                                                                <p className="font-bold text-white text-center">X</p>
                                                            </div>

                                                        </div>

                                                    ) )}
                                                </div>
                                            </div>
                                        )}

                                    </div>

                                    <div className='flex flex-col md:flex-row justify-center gap-x-10'>
                                    
                                        <button
                                            type="button"
                                            onClick={() => {
                                                navigate(location.pathname, { replace: true });
                                                setSelectedImages([]);
                                                cleanPost();
                                            }}
                                            className="bg-red-400 py-2 px-6 w-full mt-10 text-white font-bold rounded-lg hover:cursor-pointer 
                                            hover:transition-colors hover:bg-red-500 md:w-auto flex justify-start items-center gap-x-2"
                                        >
                                            <XMarkIcon className="h-6"/>
                                            Cancelar
                                        </button> 

                                        <button
                                            type="submit"
                                            className="bg-blue-500 py-2 px-6 w-full mt-10 text-white font-bold rounded-lg hover:cursor-pointer 
                                            hover:transition-colors hover:bg-blue-600 md:w-auto flex justify-start items-center gap-x-2"
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

        <EditCommentModal/>
        <DeleteCommentModal/>
    </>
  )
}

export default EditPostModal;