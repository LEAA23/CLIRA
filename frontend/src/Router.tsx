import { Route, Routes, BrowserRouter } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./views/auth/Login";
import Register from "./views/auth/Register";
import ForgotPasword from "./views/auth/ForgotPasword";

/*
El Router contiene todas las rutas que se utilizan en el frontend, dependiendo de la ruta renderiza la vista asignada
*/
const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                
                <Route path="/" element={ <AuthLayout/> }>
                    <Route index element={ <Login/> }/>
                    <Route path="/register" element={ <Register/> }/>
                    <Route path="forgot-password" element={ <ForgotPasword/> }/>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default Router;