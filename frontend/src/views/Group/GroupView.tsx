import { AcademicCapIcon, BriefcaseIcon, ChevronDoubleLeftIcon, PlusIcon } from "@heroicons/react/16/solid";
import { Link, useNavigate, useParams } from "react-router-dom";
import PostModal from "../../components/posts/PostModal";
import PostCard from "../../components/posts/PostCard";
import CommentsModal from "../../components/posts/CommentsModal";
import { useAppStore } from "../../stores/useAppStore";
import { useEffect } from "react";

const GroupView = () => {
    const navigate = useNavigate();

    //Extraemos el id del grupo
    const { id } = useParams();

    //Extraemos tanto la funcion para consultar el grupo como el state global de group
    const fetchGroup = useAppStore( state => state.fetchGroup );
    const group = useAppStore( state => state.group );

    const fetchPosts = useAppStore( state => state.fetchPosts );
    const posts = useAppStore( state => state.posts );

    //Se ejecuta cada vez que hay cambios en el id del grupo
    useEffect(() => {
        if(id) {
            fetchGroup( +id );
            fetchPosts( +id );
        }
    }, [id, fetchGroup, fetchPosts]);
  return (
    <>
        <div className="flex flex-col md:flex-row justify-between items-center">
            
            <Link 
                to="/groups"
                className="bg-blue-500 py-2 px-6 text-white font-bold rounded-lg mt-10 md:mt-15
                hover:cursor-pointer hover:transition-colors hover:bg-blue-600 w-full md:w-fit" 

            >
                <div className="flex justify-start items-center gap-x-2">   
                    <ChevronDoubleLeftIcon className="h-6"/>
                    Regresar a mis grupos
                </div>
                
            </Link>

            <button
                type="button"
                onClick={() => navigate(location.pathname + "?makePost=true")}
                className="bg-purple-500 py-2 px-6 text-white font-bold rounded-lg mt-10 md:mt-15 hover:cursor-pointer 
                hover:transition-colors hover:bg-purple-600 w-full md:w-fit flex justify-start items-center gap-x-2"
            >
                <PlusIcon className="h-6"/>
                Hacer una publicaci&oacute;n
            </button>
        </div>

        <div className="bg-white shadow rounded-2xl my-5 max-w-full">
            <div className="relative h-75 overflow-hidden rounded-2xl">
                {group.bgImage && (
                    <img 
                        src={ group.bgImage } 
                        alt="sdfsdf"
                        className="rounded-2xl brightness-75 w-full h-full object-cover" 
                    />
                )}

                <h1 className="absolute text-5xl top-20 left-10 text-white font-bold">{ group.name }</h1>
                
                <div 
                    className="absolute inset-0 left-10 top-30 flex justify-start items-start flex-col py-5 space-y-2"
                >
                    <div className="text-white flex justify-start items-center">
                        <BriefcaseIcon className="h-6 aspect-square"/>

                        <p className="font-bold">Maestro: {""}
                            <span className="text-white font-normal">{ group.teacherUser.name }</span> 
                        </p>
                    </div>
                    
                    <div className="text-white flex justify-start items-center">
                        <AcademicCapIcon className="h-6 aspect-square"/>

                        <p className="font-bold">Integrantes: {""}
                            <span className="text-white font-normal">23</span> 
                        </p>
                    </div>
                </div>
                <div className="absolute bottom-0 h-10 w-full bg-linear-to-t from-white to-transparent"></div>
            </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map( post =>  (
                <PostCard
                    key={ post.id }
                    title={ post.title }
                    content={ post.content }
                
                />

            ))}
        </div>

        <PostModal/>
        <CommentsModal/>
    </>
  )
}

export default GroupView;