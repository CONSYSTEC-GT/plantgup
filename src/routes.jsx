import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TemplateList from './pages/TemplateList';
import CreateTemplatePage from './pages/CreateTemplatePage';
import EditTemplatePage from './pages/EditTemplatePage'; // Importa el nuevo componente

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<TemplateList />} />
      <Route path="/CreateTemplatePage" element={<CreateTemplatePage />} />
      <Route path="/edit-template/" element={<EditTemplatePage />} /> {/* Nueva ruta */}
    </Routes>
  );
};

export default AppRoutes;
