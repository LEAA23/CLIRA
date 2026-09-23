import { ChatBubbleOvalLeftEllipsisIcon, HeartIcon } from "@heroicons/react/16/solid"
import { useNavigate, useParams } from "react-router-dom"
import ProfileTagName from "./ProfileTagName";
import { useAppStore } from "../../stores/useAppStore";
import PostCardOptions from "./PostCardOptions";

type PostCardProps = {
    id: number;
    title: string;
    content: string;
    firstImage: string;
    userName: string;
    userLastName: string;
}

const PostCard = ( { id, title, content, firstImage , userName, userLastName } : PostCardProps ) => {
    const navigate = useNavigate();
    const params = useParams();
    const groupId = params.id;

    const user = useAppStore( state => state.user );
    const posts = useAppStore( state => state.posts );
    const post = posts.find( post => post.id === id );

    const likePost = useAppStore( state => state.likePost );

    const handleClick = async ( id : number ) => {
        await likePost( { groupId : Number( groupId ), postId: id } );
    }
  return (
    <div 
        className="bg-white shadow rounded-lg min-w-full mx-auto flex flex-col justify-between 
        hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer"
        onClick={ () => navigate( location.pathname + `?viewPost=true&post=${id}` ) }
    >
        <div className="relative p-5 h-25 flex justify-center items-center">
            <h3 className="text-2xl text-gray-700 font-bold text-center line-clamp-2">{ title }</h3>

            {user.id === post?.user_id && (
                <div 
                    className="absolute right-2.5"
                    onClick={ e => e.stopPropagation()}
                >
                    <PostCardOptions
                        post_id={id}
                    />
                    
                </div>

            )}
        </div>

       <div className="px-5">
            <div className="h-40 overflow-hidden rounded-lg">
                <img src={ firstImage } alt="Sample image #1" className="w-full rounded-lg" />
            </div>

            <div className="-mt-8 ml-5">
                <ProfileTagName
                    name={ userName }
                    lastName={ userLastName }
                />
            </div>
        </div> 

        <div className="p-5">
            <p className="mb-5 ml-5 line-clamp-2 h-13">
                { content }
            </p>
            
            <div className="flex justify-between items-center gap-x-5 mt-2 ml-5 text-gray-300">
                <button 
                    className={`flex justify-between items-center hover:text-red-400 cursor-pointer transition-all 
                    ease-in-out duration-300 ${ post?.likedByMe? "text-red-400": "" }`}
                    onClick={ e => {
                        e.stopPropagation();
                        handleClick( id )
                    } }
                >
                    <HeartIcon className="h-8 "/>
                    { post && post?.likesCount > 0? `${post?.likesCount} Me gusta` : `Me gusta` }
                </button>

                <button 
                    className="flex justify-between items-center hover:text-blue-400 cursor-pointer transition-all 
                    ease-in-out duration-300"
                    onClick={() => navigate(location.pathname + "?commentsModal=true")}
                >
                    <ChatBubbleOvalLeftEllipsisIcon className="h-8 "/>
                    Comentarios
                </button>
            </div>
        </div>
    </div>
  )
}

export default PostCard