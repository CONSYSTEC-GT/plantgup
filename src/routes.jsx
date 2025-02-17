// src/AppRoutes.jsx
import React from 'react';
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
import ProtectedRoute from './utils/ProtectedRoute'; // Importa el componente ProtectedRoute
import LoginRequired from './pages/LoginRequired'; // Importa la página de error

const AppRoutes = () => {
  return (
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
  );
};

export default AppRoutes;