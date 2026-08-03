import { Outlet } from "react-router-dom";
import DashBoardHeader from "../components/dashboard/DashBoardHeader";
import DashBoardFooter from "../components/dashboard/DashBoardFooter";
import DashBoardSidebar from "../components/dashboard/DashBoardSidebar";

const StudentLayout = () => {
  return (
    <>
      <DashBoardHeader/>
      <main className="flex h-screen">
        <DashBoardSidebar/>
        <section className="container mx-auto px-10 pb-10 flex flex-col overflow-y-scroll">
          <Outlet/>
        </section>
      </main>
      <DashBoardFooter/>
    </>
  )
}

export default StudentLayout