import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import TemplateList from './pages/TemplateList';
import CreateTemplatePage from './pages/CreateTemplatePage';
import EditTemplatePage from './pages/EditTemplatePage';
import TemplateAll from './pages/TemplateAll';
import TemplateAproved from './pages/TemplateAproved';
import TemplateRejected from './pages/TemplateRejected';
import TemplateFailed from './pages/TemplateFailed';
import TemplateSend from './pages/TemplateSend';
import ModifyTemplatePage from './pages/ModifyTemplatePage';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './utils/ProtectedRoute';
import LoginRequired from './pages/LoginRequired';
import TokenHandler from './utils/TokenHandler'; // Importamos TokenHandler
import LoadingSpinner from './utils/LoadingSpinner';

const AppRoutes = () => {
  return (
    <>
      <TokenHandler /> {/* Agregamos TokenHandler aquí para que funcione en todas las rutas */}
      <Suspense fallback={<LoadingSpinner />}>

      <Routes>
        {/* Ruta pública para la página de error */}
        <Route path="/login-required" element={<LoginRequired />} />

        {/* Rutas protegidas */}
        <Route element={<Sidebar />}>
          <Route
            index
            element={
              <ProtectedRoute>
                <TemplateList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <TemplateList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/CreateTemplatePage"
            element={
              <ProtectedRoute>
                <CreateTemplatePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-template"
            element={
              <ProtectedRoute>
                <EditTemplatePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/modify-template"
            element={
              <ProtectedRoute>
                <ModifyTemplatePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/plantillas/todas"
            element={
              <ProtectedRoute>
                <TemplateAll />
              </ProtectedRoute>
            }
          />
          <Route
            path="/plantillas/aprovadas"
            element={
              <ProtectedRoute>
                <TemplateAproved />
              </ProtectedRoute>
            }
          />
          <Route
            path="/plantillas/rechazadas"
            element={
              <ProtectedRoute>
                <TemplateRejected />
              </ProtectedRoute>
            }
          />
          <Route
            path="/plantillas/fallidas"
            element={
              <ProtectedRoute>
                <TemplateFailed />
              </ProtectedRoute>
            }
          />
          <Route
            path="/plantillas/enviadas"
            element={
              <ProtectedRoute>
                <TemplateSend />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
      </Suspense>
    </>
  );
};

export default AppRoutes;