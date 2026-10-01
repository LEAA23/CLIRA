import { UserCircleIcon } from "@heroicons/react/16/solid";

type ProfileImageProps = {
  height: string;
  profileImage: string | null;
}

const ProfileImage = ({height, profileImage} : ProfileImageProps) => {
  return (
    <div className={`bg-white shadow rounded-full h-${height} aspect-square w-auto p-1 cursor-pointer hover:bg-blue-400 transition-all ease-in-out duration-200`}>
        {profileImage !== null? (
          <img 
            src={`${profileImage}`} 
            alt="imagen perfil" 
            className=" w-full h-full rounded-full"
          />

        ): (
          <UserCircleIcon className={`w-full h-full text-gray-400 text-center hover:text-white transition-all duration-200 ease-in-out`}/>         
        )}
    </div>
  )
}

export default ProfileImage