
const ProfileTagName = () => {
  return (
    <div className="relative">
        <div
            className="absolute bg-white hover:bg-blue-500 transition-all ease-in-out duration-300 shadow h-15 
            aspect-square rounded-4xl -mt-8 ml-5 p-1 cursor-pointer"
        >
            <div 
                className="bg-[url(/profileImage.jpg)] bg-cover bg-no-repeat h-13 aspect-square rounded-4xl mx-auto"
            ></div>
        </div>
        <div className="absolute bg-white rounded-lg shadow h-auto w-auto -mt-4 ml-23 py-1 px-2">
            <p className="text-gray-400 font-bold text-center">{"Luis Ernesto Alejandre Ayon"}</p>
        </div>
    </div>
  )
}

export default ProfileTagName