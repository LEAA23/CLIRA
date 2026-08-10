import ProfileTagName from "../posts/ProfileTagName";

const RankingCard = () => {
  return (
    <div className="bg-white shadow rounded-2xl p-5 mt-5 max-w-full flex justify-between items-center">
        <div className="flex justify-start items-center gap-x-1">
          <img src="normalMedal.png" alt="normal medal" className="h-10 aspect-square" />
          <p className="font-bold">4th</p>
        </div>

        <div className="mt-10">
          
        <ProfileTagName/>
        </div>
        <p className="font-bold">100 pts.</p>
    </div>
  )
}

export default RankingCard;