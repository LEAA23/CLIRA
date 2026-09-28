import { useNavigate } from "react-router-dom";
import ProfileImage from "../ProfileImage";

type ProfileTagNameProps = {
  id: number;
  name: string;
  lastName: string;
}

const ProfileTagName = ( { id, name, lastName } : ProfileTagNameProps ) => {
  const navigate = useNavigate();

  return (
    <div 
      className="flex justify-start items-center gap-x-2"
      onClick={ () => navigate( `/user-profile/${ id }` ) }
    >
      <ProfileImage
        height="15"
      />
      <div className=" bg-white rounded-lg shadow h-auto w-fit py-1 px-2">
        <p className="text-gray-400 font-bold text-left lg:text-center line-clamp-1 h-7">{`${name} ${ lastName?.split(" ")[0] }`}</p>
      </div>
    </div>
  )
}

export default ProfileTagName