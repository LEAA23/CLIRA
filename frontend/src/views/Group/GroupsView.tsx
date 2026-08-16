import { useEffect } from "react";
import GroupCard from "../../components/group/GroupCard"
import { useAppStore } from "../../stores/useAppStore";
import { toast } from "react-toastify";

const GroupsView = () => {

  //Extraemos la funcion para consultar el usuario que esta autenticado actualmente
  const fetchUserAuth = useAppStore( state => state.fetchUserAuth );
  //Obtenemos los valores del usuario
  const user = useAppStore( state => state.user );

  useEffect(() => {
    const getUser = async() => {
      try {
        await fetchUserAuth();
      } catch (error) {
        if(error instanceof Error) {
          toast.error(error.message);
        }
      }
    }
    getUser();
  }, []);
  
   return (
    <>
        <h1 className="text-blue-500 text-5xl my-10 text-center font-bold">Mis Grupos</h1>

        {user.rol == "teacher" && (
          <p>ewewewewewe</p>
        )}

        <div className="grid grid-cols-1 items-center justify-center md:grid-cols-2 lg:grid-cols-4 gap-x-5">
          <GroupCard/>
          <GroupCard/>
          <GroupCard/>
          <GroupCard/>
          <GroupCard/>
        </div>
    </>
  )
}

export default GroupsView;