import { ChatBubbleOvalLeftEllipsisIcon, HeartIcon } from "@heroicons/react/16/solid"
import { useNavigate } from "react-router-dom"
import ProfileTagName from "./ProfileTagName";


const PostCard = () => {
    const navigate = useNavigate();

  return (
    <div className="bg-white shadow rounded-lg max-w-full">
        <div className="p-5">
            <h3 className="text-2xl text-gray-700 font-bold text-center">Duda de esta simulacion</h3>
        </div>
        
        <div className="bg-[url(/postExample.png)] bg-cover bg-no-repeat w-ful h-full"></div>

        <ProfileTagName/>

        <div className="p-5">
            <p className="mt-5 ml-5">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fugiat voluptates aspernatur impedit adipisci, 
                cupiditate fuga, expedita quidem qui libero porro suscipit, dolorum sapiente unde recusandae dolore eveniet 
                accusantium culpa voluptate?
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