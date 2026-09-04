import { ChatBubbleOvalLeftEllipsisIcon, HeartIcon } from "@heroicons/react/16/solid"
import { useNavigate } from "react-router-dom"
import ProfileTagName from "./ProfileTagName";
import Carousel from "./Carousel";

type PostCardProps = {
    title: string,
    content: string;
}

const PostCard = ( { title, content } : PostCardProps ) => {
    const navigate = useNavigate();

  return (
    <div className="bg-white shadow rounded-lg max-w-full mx-auto flex flex-col justify-between">
        <div className="p-5 h-25">
            <h3 className="text-2xl text-gray-700 font-bold text-center line-clamp-2">{ title }</h3>
        </div>
        
        <Carousel/>

        <div className="-mt-8 ml-5">
            <ProfileTagName/>
        </div>

        <div className="p-5">
            <p className="mb-5 ml-5 line-clamp-2 h-13">
                { content }
            </p>
            <div className="flex justify-between items-center gap-x-5 mt-2 ml-5 text-gray-300">
                <button 
                    className="flex justify-between items-center hover:text-red-400 cursor-pointer transition-all 
                    ease-in-out duration-300"
                >
                    <HeartIcon className="h-8 "/>
                    Me gusta
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