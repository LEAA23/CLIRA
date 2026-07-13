import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const AuthLayout = () => {
  return (
    <>
        <Header/>
        <main className="container mx-auto">
            <Outlet/>
        </main>
        <Footer/>

    </>
  )
}

export default AuthLayout