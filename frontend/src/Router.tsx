import { Suspense, lazy } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";

/**
 * AUTH PAGES
 */
const LoginPage = lazy( () => import("./views/auth/LoginView") );
const RegisterPage = lazy( () => import("./views/auth/RegisterView") );
const ForgotPasswordPage = lazy( () => import("./views/auth/ForgotPaswordView") );
const ConfirmAccountPage = lazy( () => import("./views/auth/ConfirmAccountView") );
const NewPasswordPage = lazy( () => import("./views/auth/NewPasswordView") );

/*
El Router contiene todas las rutas que se utilizan en el frontend, dependiendo de la ruta renderiza la vista asignada
*/
const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                
                <Route path="/auth" element={ <AuthLayout/> }>
                    <Route path="login" element={ <Suspense fallback="carando..."> <LoginPage/> </Suspense> }/>
                    <Route path="register" element={ <Suspense fallback="cargando..."> <RegisterPage/> </Suspense> }/>
                    <Route path="confirm-account" element={ <Suspense fallback="cargando..."> <ConfirmAccountPage/> </Suspense> }/>
                    <Route path="forgot-password" element={ <Suspense fallback="cargando..."> <ForgotPasswordPage/> </Suspense> }/>
                    <Route path="new-password/:token" element={ <Suspense fallback="cargando..."> <NewPasswordPage/> </Suspense> } />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default Router;