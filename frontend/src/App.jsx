import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import NewsPage from './pages/NewsPage';
import ContactPage from './pages/ContactPage';
import NewsDetailPage from './pages/NewsDetailPage';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/:id" element={<NewsDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </AnimatePresence>
    </Layout>
  );
}

function App() {
  // Use basename for GitHub Pages, empty for local development
  const basename = import.meta.env.PROD ? '/senator-hussein-khodair' : '';
  
  return (
    <Router basename={basename}>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
