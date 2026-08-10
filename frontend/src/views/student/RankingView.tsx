import RankingCard from "../../components/ranking/rankingCard"
import SearchBar from "../../components/SearchBar"

const RankingView = () => {
  return (
    <>
      <h1 className="text-blue-500 text-center text-5xl font-bold my-10 ">Ranking</h1>

      <div className="bg-white shadow rounded-2xl p-5 max-w-full">
        <div className="flex flex-col md:flex-row justify-evenly items-center gap-10">
          <div className="flex flex-col">
            <div 
              className="bg-white shadow-lg h-40 aspect-square rounded-full p-2 
              cursor-pointer hover:bg-blue-400 ease-in-out transition-all duration-200"
            >
              <div className="relative bg-[url(/profileImage.jpg)] bg-cover bg-center bg-no-repeat aspect-square rounded-full w-full h-full">
                <img 
                  src="bronzeMedal.png" 
                  alt="bronze medal"
                  className="absolute h-20 aspect-square top-27 left-1/4" 
                />
              </div>
            </div>
            <div className="mt-10 text-center font-semibold text-xl">
              <p>Luis Ernesto</p>
              <p className="text-gray-400 font-semibold text-sm">1200 pts.</p>
            </div>
          </div>

          <div className="flex flex-col"> 
            <div 
              className="bg-white shadow-lg h-60 aspect-square rounded-full -mt-10 p-2 
              cursor-pointer hover:bg-blue-400 ease-in-out transition-all duration-200"
              
            >
              <div className=" relative bg-[url(/profileImage.jpg)] bg-cover bg-center bg-no-repeat aspect-square rounded-full w-full h-full">
                <img 
                  src="goldMedal.png" 
                  alt="gold medal"
                  className="absolute h-30 aspect-square top-40 left-1/4" 
                />
              </div>
            </div>

            <div className="mt-10 text-center font-semibold text-2xl">
              <p>Thelma Ramirez</p>
              <p className="text-gray-400 font-semibold text-sm">9834 pts.</p>
            </div>
          </div>

          <div className="flex flex-col">
            <div 
              className="bg-white shadow-lg h-40 aspect-square rounded-full p-2 
              cursor-pointer hover:bg-blue-400 ease-in-out transition-all duration-200"
            >
              <div className="relative bg-[url(/profileImage.jpg)] bg-cover bg-center bg-no-repeat aspect-square rounded-full w-full h-full">
                <img 
                  src="silverMedal.png" 
                  alt="gold medal"
                  className="absolute h-20 aspect-square top-27 left-1/4" 
                />
              </div>
            </div>

            <div className="mt-10 text-center font-semibold text-xl">
              <p>Alex Marin</p>
              <p className="text-gray-400 font-semibold text-sm">4300 pts.</p>
            </div>

          </div>

        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-5">
        <div>
          <RankingCard/>
          <RankingCard/>
          <RankingCard/>
          <RankingCard/>
          <RankingCard/>
          <RankingCard/>
          <RankingCard/>
        </div>
        <div className="bg-white shadow rounded-2xl max-w-full p-5 mt-5">
          
        </div>
      </div>
    </>
  )
}

export default RankingView