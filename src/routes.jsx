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
import Sidebar from './components/Sidebar';

const AppRoutes = () => {
  return (

    <Routes>
      <Route element={<Sidebar />}>
        <Route index element={<TemplateList />} />
        <Route path="/dashboard" element={<TemplateList />} />
        <Route path="/CreateTemplatePage" element={<CreateTemplatePage />} />
        <Route path="/edit-template" element={<EditTemplatePage />} />
        <Route path="/plantillas/todas" element={<TemplateAll />} />
        <Route path="/plantillas/aprovadas" element={<TemplateAproved />} />
        <Route path="/plantillas/rechazadas" element={<TemplateRejected />} />
        <Route path="/plantillas/fallidas" element={<TemplateFailed />} />
        <Route path="/plantillas/enviadas" element={<TemplateSend />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
