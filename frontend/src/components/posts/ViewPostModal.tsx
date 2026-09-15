import { Transition, Dialog } from "@headlessui/react";
import { Fragment } from "react/jsx-runtime";
import {  useLocation, useNavigate, useParams } from "react-router-dom";
import { useShowModal } from "../../hooks/useShowModal";
import { useAppStore } from "../../stores/useAppStore";
import Carousel from "./Carousel";
import ProfileTagName from "./ProfileTagName";
import { HeartIcon, PaperAirplaneIcon, TrashIcon } from "@heroicons/react/16/solid";
import CommentaCard from "./CommentCard";
import { useForm } from "react-hook-form";
import type { CommentForm } from "../../types";
import ErrorMessage from "../ErrorMessage";
import { toast } from "react-toastify";
import { useEffect } from "react";

const ViewPostModal = () => {
    const navigate = useNavigate();
    const showModal = useShowModal("viewPost");

    const location = useLocation();
    const queryParams = new URLSearchParams( location.search );
    const postId = queryParams.get("post");

    const params = useParams();
    const groupId = params.id;

    const posts = useAppStore( state => state.posts );
    const post = posts.find( post => +postId! === post.id );
    const likePost = useAppStore( state => state.likePost );

    const createComment = useAppStore( state => state.createComment );
    const fecthComments = useAppStore( state => state.fecthComments );
    const comments = useAppStore( state => state.currentPostComments );

    const initialValues : CommentForm = {
        content: ""
    }
    
    const { handleSubmit, register, formState: { errors }, reset, resetField } = useForm( { defaultValues: initialValues } );

    const handleClick = async ( id : number ) => {
        await likePost( { groupId : Number( groupId ), postId: id } );
    }

    useEffect(() => {
        fecthComments( { groupId : +groupId!, postId: +postId! } ); 
    }, [ fecthComments, postId ]);

    const handleSubmitComment = async( formData: CommentForm ) => {
        const data = {
            groupId: +groupId!,
            postId: +postId!,
            content: formData.content
        };
        try {
            const message = await createComment( data );
            toast.success( message );
            reset();
        } catch (error) {
            if( error instanceof Error ) {
                toast.error( error.message );
            }
        }
    }

  return (
   <>
        <Transition appear show={showModal} as={Fragment}>
            <Dialog as="div" className="relative z-10" 
                onClose={() => {
                navigate(location.pathname, { replace: true })
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
                            <Dialog.Panel className="w-5/6 max-w-5xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-10">
                                <Dialog.Title
                                    as="h3"
                                    className="font-black text-4xl my-2 text-center"
                                >
                                    { post?.title }
                                </Dialog.Title>


                                <div className="p-5 max-w-full mt-5">
                                    <div className="grid grid-cols-2 space-x-5 ">
                                        <div className="h-full">
                                            {post?.images?.[0].path && (
                                                <Carousel firstImage={ post?.images?.[0].path } />
                                            )}
                                        </div>
                                        <div className="max-w-full flex flex-col justify-center">
                                            <div className="mb-5 border-b-gray-300 pb-5 border-b-2">
                                                {post && (
                                                    <ProfileTagName
                                                        name={ post?.user.name }
                                                        lastName={ post?.user.lastName }
                                                    />   

                                                )}
                                            </div>
                                            <p>
                                                { post?.content }
                                            </p>
                                            <div className="flex justify-between items-center gap-x-5 mt-5 text-gray-300">
                                                <button 
                                                    className={`flex justify-between items-center hover:text-red-400 cursor-pointer transition-all 
                                                    ease-in-out duration-300 ${ post?.likedByMe? "text-red-400": "" }`}
                                                    onClick={ e => {
                                                        e.stopPropagation();
                                                        if(post?.id !== undefined ) handleClick( post?.id );
                                                    } }
                                                >
                                                    <HeartIcon className="h-8 "/>
                                                    { post && post?.likesCount > 0? `${post?.likesCount} Me gusta` : `Me gusta` }
                                                </button>
                                
                                            </div>
                                        </div>
                                    </div>

                                    <div className="max-w-full">
                                        <h3 className="text-2xl font-bold text-center mt-5">Comentarios</h3>
                                    </div>

                                    <div className="overflow-hidden">
                                        <div className="flex flex-col space-y-5 h-auto p-5 overflow-y-scroll">
                                            {comments.length? (
                                                comments.map( comment => (
                                                    <CommentaCard
                                                        id={ comment.id }
                                                        content= { comment.content }
                                                        post_id= { comment.post_id }
                                                        user={ comment.user }
                                                        createdAt={ comment.createdAt }
                                                        updatedAt={ comment.updatedAt }
                                                    />
                                                ) )
                                            ): (
                                                <p className="font-semibold text-gray-500 text-center">No hay comentarios a&uacute;n</p>
                                            )}

                                        </div>
                                    </div>

                                    <div className="bg-white shadow-xl p-5 rounded-lg max-w-full my-5">
                                        <form
                                            onSubmit={ handleSubmit( handleSubmitComment ) }
                                        >
                                            <label 
                                                htmlFor="content"
                                                className="text-gray-600 font-bold text-xl"
                                            >Comentario</label>
                                            <textarea 
                                                id="content"
                                                className="border border-gray-400 p-2 mt-3 w-full rounded-lg"
                                                {...register("content", {
                                                    required: "El contenido del comentario es obligatorio",
                                                })}
                                            ></textarea>
                                            { errors.content && (
                                                <ErrorMessage>{ String( errors.content.message ) }</ErrorMessage>
                                            ) }

                                            <div className='flex flex-col md:flex-row justify-center gap-x-10'>
                                        
                                                <button
                                                    type="button"
                                                    onClick={() => resetField("content") }
                                                    className="bg-red-400 py-2 px-6 w-full mt-10 text-white font-bold rounded-lg hover:cursor-pointer 
                                                    hover:transition-colors hover:bg-red-500 md:w-auto flex justify-start items-center gap-x-2"
                                                >
                                                    <TrashIcon className="h-6"/>
                                                    Borrar
                                                </button> 

                                                <button
                                                    type="submit"
                                                    className="bg-blue-500 py-2 px-6 w-full mt-10 text-white font-bold rounded-lg hover:cursor-pointer 
                                                    hover:transition-colors hover:bg-blue-600 md:w-auto flex justify-start items-center gap-x-2"
                                                >
                                                    <PaperAirplaneIcon className="h-6"/>
                                                    Publicar
                                                </button>  
                                            </div>
                                        </form>

                                    </div>
                                
                                

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

export default ViewPostModal