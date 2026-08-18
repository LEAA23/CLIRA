import { useEffect } from "react";
import GroupCard from "../../components/group/GroupCard"
import { useAppStore } from "../../stores/useAppStore";
import { toast } from "react-toastify";
import { PlusIcon } from "@heroicons/react/16/solid";
import { useNavigate } from "react-router-dom";
import CreateGroupModal from "../../components/group/CreateGroupModal";

const GroupsView = () => {
  const navigate = useNavigate();

  //Extraemos la funcion para consultar el usuario que esta autenticado actualmente
  const fetchUserAuth = useAppStore( state => state.fetchUserAuth );
  //Funcion para consultar lso grupos
  const fetchGroups = useAppStore(  state => state.fetchGroups );
  //Obtenemos los valores del usuario
  const user = useAppStore( state => state.user );

  const groups = useAppStore( state => state.groups );

  useEffect(() => {
    const getUser = async() => {
      try {
        await fetchUserAuth();
        await fetchGroups();
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

        {user.rol === "teacher" && (
          <div className="flex justify-end items-center mb-5">
            <button
              type="button"
              onClick={() => navigate( location.pathname + "?createGroup=true" ) }
              className="bg-purple-500 py-2 px-6 text-white font-bold rounded-lg mt-10 md:mt-5 hover:cursor-pointer 
              hover:transition-colors hover:bg-purple-600 w-full md:w-fit flex justify-start items-center gap-x-2"
            >
              <PlusIcon className="h-6"/>
              Crear grupo
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 items-center justify-center md:grid-cols-2 lg:grid-cols-4 gap-x-5">
          {groups.map( group => (
            <GroupCard
              key={group.id}
              id={group.id}
              name={group.name}
              teacher={group.teacherUser.name}
            />
          ))}
        </div>
        
        <CreateGroupModal/>
    </>
  )
}

export default GroupsView;