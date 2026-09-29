import { useNavigate } from "react-router-dom";
import ProfileImage from "../ProfileImage";

type ProfileTagNameProps = {
  id: number;
  name: string;
  lastName: string;
  profileImage: string | null;
}

const ProfileTagName = ( { id, name, lastName, profileImage } : ProfileTagNameProps ) => {
  const navigate = useNavigate();

  return (
    <div 
      className="flex justify-start items-center gap-x-2"
      onClick={ () => navigate( `/user-profile/${ id }` ) }
    >
      
      <ProfileImage
        height="15"
        profileImage={ profileImage }
      />
      <div className="text-gray-400 hover:text-white bg-white hover:bg-blue-400 rounded-lg shadow h-auto w-fit py-1 px-2 
            cursor-pointer transition-all duration-200 ease-in-out"
      >
        <p className="font-bold text-left lg:text-center line-clamp-1 h-7">{`${name} ${ lastName?.split(" ")[0] }`}</p>
      </div>
    </div>
  )
}

export default ProfileTagName