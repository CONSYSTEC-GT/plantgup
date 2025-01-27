import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import TemplateList from './pages/TemplateList';
import CreateTemplatePage from './pages/CreateTemplatePage';
import EditTemplatePage from './pages/EditTemplatePage'; // Importa el nuevo componente
import Sidebar from './components/Sidebar';

const AppRoutes = () => {
  return (

    <Routes>
      <Route element={<Sidebar />}>
        <Route index element={<TemplateList />} />
        <Route path="/dashboard" element={<TemplateList />} />
        <Route path="/CreateTemplatePage" element={<CreateTemplatePage />} />
        <Route path="/edit-template" element={<EditTemplatePage />} />
        <Route path="/plantillas/todas" element={<EditTemplatePage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
