import { useParams } from "react-router-dom";
import { useAppStore } from "../../stores/useAppStore"
import { useEffect } from "react";

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

    </>
  )
}

export default UserProfileView