import ProfileImage from "../ProfileImage";

type ProfileTagNameProps = {
  name: string;
  lastName: string;
}

const ProfileTagName = ( { name, lastName } : ProfileTagNameProps ) => {
  return (
    <div className="flex justify-start items-center gap-x-2">
        <ProfileImage
            height="15"
        />
        <div className=" bg-white rounded-lg shadow h-auto w-fit py-1 px-2">
            <p className="text-gray-400 font-bold text-center">{`${name} ${lastName}`}</p>
        </div>
    </div>
  )
}

export default ProfileTagName