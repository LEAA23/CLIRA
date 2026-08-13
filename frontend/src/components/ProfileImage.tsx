
type ProfileImageProps = {
  height: string
}

const ProfileImage = ({height} : ProfileImageProps) => {
  return (
    <div className={`bg-white shadow rounded-full h-${height} p-1 cursor-pointer hover:bg-blue-400 transition-all ease-in-out duration-200`}>
        <img 
          src="/profileImage.jpg" 
          alt="imagen perfil" 
          className=" w-full h-full rounded-full"
        />
    </div>
  )
}

export default ProfileImage