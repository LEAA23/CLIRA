import { useParams } from "react-router-dom";
import { useAppStore } from "../../stores/useAppStore"
import { useEffect } from "react";
import ProfileImage from "../../components/ProfileImage";
import UserRankingCard from "../../components/ranking/UserRankingCard";
import { EnvelopeIcon, UserIcon } from "@heroicons/react/16/solid";

const UserProfileView = () => {
  const params = useParams();
  const id = +params.id!;

  const fetchUserProfile = useAppStore( state => state.fetchUserProfile );
  const userProfileSearched = useAppStore( state => state.userProfileSearched );
  useEffect(() => {
    const getProfile = async () => {
      await fetchUserProfile( id );
    }
    getProfile();
  }, [ fetchUserProfile, id ]);

  return (
    <>
      <h1 className="text-blue-500 text-center text-5xl font-bold my-10 ">Perfil de Usuario</h1>

      <section className="bg-white p-5 h- max-w-full rounded-2xl shadow">

        <div className="grid grid-cols-5 justify-center items-center gap-x-5">

          <div className="col-span-3 flex flex-col items-center">
            <ProfileImage
              height="60"
              profileImage={ userProfileSearched.profileImage }
            />
            <UserRankingCard/>

          </div>
          <div className=" col-span-2 flex flex-col gap-y-5 items-center justify-center">

            <div className="border-l-4 p-5 border-blue-100 h-full w-full bg-white shadow-xl rounded-2xl">
              <div>
                <span className="font-semibold">
                  Tipo de usuario:
                </span>
                { userProfileSearched.rol === "student"? (
                  <p>Estudiante</p>
                ): (
                  <p className="flex justify-between items-center gap-x-3 bg-blue-500 px-4 py-2 mt-5 rounded-lg w-fit text-white font-bold">
                    <UserIcon className="h-8"/>
                    Maestro
                  </p>
                ) }
              </div>
            </div>

            <div className="border-l-4 p-5 border-blue-200 h-full w-full bg-white shadow-xl rounded-2xl">
              <div>
                <span className="font-semibold">
                  Correo electronico:
                </span>
                <p className="flex justify-between items-center gap-x-3 bg-blue-600 px-4 py-2 mt-5 rounded-lg w-fit text-white font-bold">
                  <EnvelopeIcon className="h-8"/>
                  { userProfileSearched.email }
                </p>
              </div>
            </div>

            <div className="border-l-4 p-5 border-blue-400 h-full w-full bg-white shadow-xl rounded-2xl">
              <div>
                <span className="font-semibold">
                  Grupos:
                </span>
                <p className="flex justify-between items-center gap-x-3 bg-blue-600 px-4 py-2 mt-5 rounded-lg w-fit text-white font-bold">
                  { userProfileSearched.email }
                </p>
              </div>
            </div>

            <div className="border-l-4 p-5 border-blue-500 h-full w-full bg-white shadow-xl rounded-2xl">
              <div>
                <span className="font-semibold">
                  Publicaciones:
                </span>
                <p className="mt-5 text-2xl rounded-lg w-fit font-bold">
                  { 2 }
                </p>
              </div>
            </div>

            <div className="border-l-4 p-5 border-blue-500 h-full w-full bg-white shadow-xl rounded-2xl">
              <div>
                <span className="font-semibold">
                  Me gusta:
                </span>
                <p className="mt-5 text-2xl rounded-lg w-fit font-bold">
                  { 98 }
                </p>
              </div>
            </div>

          </div>
        </div>

      </section>

    </>
  )
}

export default UserProfileView