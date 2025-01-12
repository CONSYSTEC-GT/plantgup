import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppTabs from './components/AppTabs';
import TemplateList from './components/TemplateList'
import CreateTemplatePage from './pages/CreateTemplatePage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<TemplateList />} />
      <Route path="/create-template-page" element={<CreateTemplatePage />} />
    </Routes>
  );
};

export default AppRoutes;
