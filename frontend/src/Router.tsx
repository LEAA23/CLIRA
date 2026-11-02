import { Suspense, lazy } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import StudentLayout from "./layouts/StudentLayout";

/**
 * AUTH PAGES
 */
const LoginPage = lazy(() => import("./views/auth/LoginView"));
const RegisterPage = lazy(() => import("./views/auth/RegisterView"));
const ForgotPasswordPage = lazy(() => import("./views/auth/ForgotPaswordView"));
const ConfirmAccountPage = lazy(() => import("./views/auth/ConfirmAccountView"));
const NewPasswordPage = lazy(() => import("./views/auth/NewPasswordView"));
const AboutPage = lazy(() => import("./views/auth/AboutView"));
const ContactPage = lazy(() => import("./views/auth/ContactView"));

/**
 * PUBLIC CATALOG
 */
const CatalogPage = lazy(() => import("./views/auth/CatalogView"));

/**
 * WORK PAGES
 */
const DashBoardPage = lazy(() => import("./views/Dashboard/DashBoardView"));
const CasesPage = lazy(() => import("./views/Cases/CasesView"));
const ProgressPage = lazy(() => import("./views/Progress/ProgressView"));
const SimulationPage = lazy(() => import("./views/Cases/SimulationView"));
const GroupsPage = lazy(() => import("./views/Group/GroupsView"));
const GroupPage = lazy(() => import("./views/Group/GroupView"));
const RankingPage = lazy(() => import("./views/ranking/RankingView"));
const UserProfilePage = lazy(() => import("./views/User/UserProfileView"));
const SettingsPage = lazy(() => import("./views/Settings/SettingsView"));

/*
El Router contiene todas las rutas que se utilizan en el frontend.
Dependiendo de la ruta, renderiza la vista asignada.
*/
const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* AUTH PAGES */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route
            path="login"
            element={
              <Suspense fallback="Cargando...">
                <LoginPage />
              </Suspense>
            }
          />

          <Route
            path="register"
            element={
              <Suspense fallback="Cargando...">
                <RegisterPage />
              </Suspense>
            }
          />

          <Route
            path="confirm-account"
            element={
              <Suspense fallback="Cargando...">
                <ConfirmAccountPage />
              </Suspense>
            }
          />

          <Route
            path="forgot-password"
            element={
              <Suspense fallback="Cargando...">
                <ForgotPasswordPage />
              </Suspense>
            }
          />

          <Route
            path="new-password/:token"
            element={
              <Suspense fallback="Cargando...">
                <NewPasswordPage />
              </Suspense>
            }
          />

          <Route
            path="sobre-nosotros"
            element={
              <Suspense fallback="Cargando...">
                <AboutPage />
              </Suspense>
            }
          />

          <Route
            path="contactanos"
            element={
              <Suspense fallback="Cargando...">
                <ContactPage />
              </Suspense>
            }
          />
        </Route>

        {/* CATÁLOGO PÚBLICO: NO REQUIERE INICIAR SESIÓN */}
        <Route
          path="/catalogo"
          element={
            <Suspense fallback="Cargando catálogo...">
              <CatalogPage />
            </Suspense>
          }
        />

        {/* WORK PAGES */}
        <Route path="/" element={<StudentLayout />}>
          <Route
            index
            element={
              <Suspense fallback="Cargando...">
                <DashBoardPage />
              </Suspense>
            }
          />

          <Route
            path="clinical-cases"
            element={
              <Suspense fallback="Cargando...">
                <CasesPage />
              </Suspense>
            }
          />

          <Route
            path="simulation/:id"
            element={
              <Suspense fallback="Cargando...">
                <SimulationPage />
              </Suspense>
            }
          />

          <Route
            path="progress"
            element={
              <Suspense fallback="Cargando...">
                <ProgressPage />
              </Suspense>
            }
          />

          <Route
            path="groups"
            element={
              <Suspense fallback="Cargando...">
                <GroupsPage />
              </Suspense>
            }
          />

          <Route
            path="groups/:id"
            element={
              <Suspense fallback="Cargando...">
                <GroupPage />
              </Suspense>
            }
          />

          <Route
            path="ranking"
            element={
              <Suspense fallback="Cargando...">
                <RankingPage />
              </Suspense>
            }
          />

          <Route
            path="user-profile/:id"
            element={
              <Suspense fallback="Cargando...">
                <UserProfilePage />
              </Suspense>
            }
          />

          <Route
            path="settings"
            element={
              <Suspense fallback="Cargando...">
                <SettingsPage />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;