import { useEffect, useState } from "react";
import { Switch } from '@headlessui/react';
import RankingCard from "../../components/ranking/RankingCard";
import UserRankingCard from "../../components/ranking/UserRankingCard";
import SearchBar from "../../components/SearchBar";
import useConfetti, { type confettiType } from "../../hooks/useConfetti";
import { SparklesIcon } from "@heroicons/react/16/solid";

const RankingView = () => {
  //State para boton de confetti
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    if(!enabled) return;

    //El confetti se va  adisparar cada 3 segundos si esta activado
    const interval = setInterval(() => {
      const confettiSettings : confettiType = {
        particleRatio: 1,
        opts: {
          spread: 100,
          startVelocity: 55
        },
        count: Math.floor( Math.random() * 300 ),
        defaults: {
          origin: {
            y: 0.9
          }
        }
      }
      useConfetti(confettiSettings);
    }, 4000);
    return () => clearInterval(interval)
  }, [enabled]);


  return (
    <>
      <h1 className="text-blue-500 text-center text-5xl font-bold my-10 ">Ranking</h1>

      <div className="flex justify-end items-center gap-x-2 mb-5">
        <SparklesIcon className={` ${enabled? "text-blue-500" : "text-gray-400"} h-8`}/>
        <Switch
          checked={enabled}
          onChange={setEnabled}
          className="group inline-flex cursor-pointer h-6 w-11 items-center rounded-full bg-gray-200 transition data-checked:bg-blue-600"
        >
          <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-6" />
        </Switch>
      </div>

      <div className="max-w-full">

        <div className="flex flex-col md:flex-row justify-center items-end gap-15 sha">

          <div 
            className="flex flex-col bg-linear-to-t from-gray-50 via-25% via-blue-500 to-blue-500 h-full p-5 
            rounded-t-4xl max-w-min"
          > 
            <div 
              className="bg-white h-40 rounded-full p-1 cursor-pointer"
            >

              <div className="relative bg-[url(/profileImage.jpg)] bg-cover bg-center bg-no-repeat aspect-square rounded-full w-full h-full">
                <img 
                  src="bronzeMedal.png" 
                  alt="bronze medal"
                  className="absolute h-20 top-27 left-1/3" 
                />
              </div>
            </div>
            <div className="mt-10 text-center font-semibold text-xl text-white p-1">
              <p className="font-bold text-xl">#3</p>
              <p>Luis Ernesto</p>
              <p className="font-bold text-sm">1200 pts.</p>
            </div>
          </div>

          <div className="flex flex-col bg-linear-to-t from-gray-50 via-25% via-blue-500 to-blue-500 h-full p-5 rounded-t-4xl max-w-min"> 
            <div className="bg-white h-60 rounded-full p-1 cursor-pointer">
              <div className=" relative bg-[url(/profileImage.jpg)] bg-cover bg-center bg-no-repeat aspect-square rounded-full w-full h-full">
                <img 
                  src="goldMedal.png" 
                  alt="gold medal"
                  className="absolute h-30 top-40 left-1/3" 
                />
              </div>
            </div>

            <div className="mt-10 text-center font-semibold text-2xl text-white p-2">
              <p className="font-bold text-2xl">#1</p>
              <p>Thelma Ramirez</p>
              <p className="font-bold text-sm">9834 pts.</p>
            </div>
          </div>

          <div 
            className="flex flex-col bg-linear-to-t from-gray-50 via-25% via-blue-500 to-blue-500 h-full p-5 rounded-t-4xl 
            max-w-min"
          > 
            <div className="bg-white h-40 rounded-full p-1 cursor-pointer">

              <div className="relative bg-[url(/profileImage.jpg)] bg-cover bg-center bg-no-repeat aspect-square rounded-full w-full h-full">
                <img 
                  src="silverMedal.png" 
                  alt="gold medal"
                  className="absolute h-20 top-27 left-1/3" 
                />
              </div>
            </div>

            <div className="mt-10 text-center font-semibold text-xl text-white p-1">
              <p className="font-bold text-xl">#2</p>
              <p>Alex Marin</p>
              <p className="font-bold text-sm">4300 pts.</p>
            </div>

          </div>

        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
        <div>
          <RankingCard/>
          <RankingCard/>
          <RankingCard/>
          <RankingCard/>
          <RankingCard/>
          <RankingCard/>
          <RankingCard/>
          <RankingCard/>
        </div>
        <div className="bg-white shadow rounded-2xl max-w-full p-5 mt-5">

          <div className="flex flex-col">
            <SearchBar
              pendingCases={false}
              filters={false}
            />

            <UserRankingCard/>

          </div>
        </div>
      </div>
    </>
  )
}

export default RankingView