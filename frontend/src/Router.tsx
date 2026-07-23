import { Route, Routes, BrowserRouter } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import LoginView from "./views/auth/LoginView";
import RegisterView from "./views/auth/RegisterView";
import ForgotPaswordView from "./views/auth/ForgotPaswordView";
import ConfirmAccountView from "./views/auth/ConfirmAccountView";
import NewPasswordView from "./views/auth/NewPasswordView";

/*
El Router contiene todas las rutas que se utilizan en el frontend, dependiendo de la ruta renderiza la vista asignada
*/
const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                
                <Route path="/auth" element={ <AuthLayout/> }>
                    <Route path="login" element={ <LoginView/> }/>
                    <Route path="register" element={ <RegisterView/> }/>
                    <Route path="confirm-account" element={ <ConfirmAccountView/> }/>
                    <Route path="forgot-password" element={ <ForgotPaswordView/> }/>
                    <Route path="new-password/:token" element={ <NewPasswordView/> } />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default Router;