import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppStore } from "../../stores/useAppStore";
import ProfileImage from "../../components/ProfileImage";
import UserRankingCard from "../../components/ranking/UserRankingCard";
import {
  AcademicCapIcon,
  EnvelopeIcon,
  UserIcon,
} from "@heroicons/react/16/solid";
import UserProfileImageOptions from "../../components/user/UserProfileImageOptions";
import UserProfileUpdateImageModal from "../../components/user/UserProfileUpdateImageModal";
import UserProfileDeleteImageModal from "../../components/user/UserProfileDeleteImageModal";
import { getRanking, type RankingEntry } from "../../api/rankingApi";

const UserProfileView = () => {
  const params = useParams();
  const id = Number(params.id);

  const fetchUserAuth = useAppStore((state) => state.fetchUserAuth);
  const user = useAppStore((state) => state.user);

  const fetchUserProfile = useAppStore((state) => state.fetchUserProfile);
  const userProfileSearched = useAppStore(
    (state) => state.userProfileSearched
  );

  const [profileRanking, setProfileRanking] =
    useState<RankingEntry | null>(null);

  // Cargar los datos del perfil y del usuario autenticado.
  useEffect(() => {
    if (!Number.isInteger(id) || id <= 0) return;

    const getProfile = async () => {
      await Promise.allSettled([
        fetchUserProfile(id),
        fetchUserAuth(),
      ]);
    };

    void getProfile();
  }, [fetchUserProfile, fetchUserAuth, id]);

  // Consultar la posición y puntuación real del estudiante.
  useEffect(() => {
    let isMounted = true;

    const loadProfileRanking = async () => {
      setProfileRanking(null);

      try {
        const entries = await getRanking();

        if (!isMounted) return;

        const userRanking =
          entries.find((entry) => entry.id === id) ?? null;

        setProfileRanking(userRanking);
      } catch (error) {
        console.error(
          "No se pudo cargar el ranking del perfil:",
          error
        );

        if (isMounted) {
          setProfileRanking(null);
        }
      }
    };

    if (Number.isInteger(id) && id > 0) {
      void loadProfileRanking();
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  return (
    <>
      <h1 className="text-blue-500 text-center text-5xl font-bold my-10">
        Perfil de Usuario
      </h1>

      <section className="bg-white p-5 max-w-full rounded-2xl shadow">
        <div className="grid grid-cols-1 md:grid-cols-5 justify-center items-start gap-5">
          <div className="md:col-span-3 flex flex-col items-center">
            <ProfileImage
              height="60"
              profileImage={userProfileSearched.profileImage}
            />

            {user.id === userProfileSearched.id && (
              <div className="-mt-5 bg-white h-8 p-1 aspect-square text-center my-auto text-blue shadow rounded-full hover:bg-blue-500 cursor-pointer">
                <UserProfileImageOptions />
              </div>
            )}

            {userProfileSearched.rol === "student" && (
              <UserRankingCard entry={profileRanking} />
            )}
          </div>

          <div className="md:col-span-2 flex flex-col gap-y-5 items-center justify-center w-full">
            <div className="border-l-4 p-5 border-blue-100 w-full bg-white shadow-xl rounded-2xl">
              <span className="font-semibold">
                Tipo de usuario:
              </span>

              {userProfileSearched.rol === "student" ? (
                <p className="flex items-center gap-x-3 bg-blue-500 px-4 py-2 mt-5 rounded-lg w-fit text-white font-bold">
                  <AcademicCapIcon className="h-8" />
                  Estudiante
                </p>
              ) : userProfileSearched.rol === "teacher" ? (
                <p className="flex items-center gap-x-3 bg-blue-500 px-4 py-2 mt-5 rounded-lg w-fit text-white font-bold">
                  <UserIcon className="h-8" />
                  Maestro
                </p>
              ) : (
                <p className="mt-3 text-gray-500">
                  Cargando información...
                </p>
              )}
            </div>

            <div className="border-l-4 p-5 border-blue-200 w-full bg-white shadow-xl rounded-2xl">
              <span className="font-semibold">
                Correo electrónico:
              </span>

              <p className="flex items-center gap-x-3 flex-wrap break-all bg-blue-600 px-4 py-2 mt-5 rounded-lg w-fit max-w-full text-white font-bold">
                <EnvelopeIcon className="h-8 shrink-0" />
                {userProfileSearched.email || "Cargando..."}
              </p>
            </div>

            <div className="border-l-4 p-5 border-blue-400 w-full bg-white shadow-xl rounded-2xl">
              <span className="font-semibold">
                Grupos:
              </span>

              <p className="flex items-center flex-wrap gap-x-3 break-all bg-blue-600 px-4 py-2 mt-5 rounded-lg w-fit max-w-full text-white font-bold">
                {userProfileSearched.email || "Sin información"}
              </p>
            </div>

            <div className="border-l-4 p-5 border-blue-500 w-full bg-white shadow-xl rounded-2xl">
              <span className="font-semibold">
                Publicaciones:
              </span>

              <p className="mt-5 text-2xl font-bold">
                {userProfileSearched.postsCount}
              </p>
            </div>

            <div className="border-l-4 p-5 border-blue-500 w-full bg-white shadow-xl rounded-2xl">
              <span className="font-semibold">
                Me gusta:
              </span>

              <p className="mt-5 text-2xl font-bold">
                {userProfileSearched.likesCount}
              </p>
            </div>
          </div>
        </div>
      </section>

      <UserProfileUpdateImageModal />
      <UserProfileDeleteImageModal />
    </>
  );
};

export default UserProfileView;
