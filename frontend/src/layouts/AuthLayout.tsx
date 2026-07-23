import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ToastContainer } from "react-toastify";

const AuthLayout = () => {
  return (
    <>
      <Header/>
      <main className="container mx-auto">
          <Outlet/>
      </main>
      <Footer/>

      <ToastContainer
        pauseOnFocusLoss={false}
        pauseOnHover={false}
      />

    </>
  )
}

export default AuthLayout