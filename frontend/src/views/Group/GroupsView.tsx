import GroupCard from "../../components/group/GroupCard"

const GroupsView = () => {
  return (
    <>
        <h1 className="text-blue-500 text-5xl my-10 text-center font-bold">Mis Grupos</h1>

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