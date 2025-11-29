import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import NewsPage from './pages/NewsPage';
import ContactsPage from './pages/ContactsPage';
import { getToken } from './utils/auth';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!getToken());
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/" /> : <LoginPage setIsAuthenticated={setIsAuthenticated} />
        } />
        <Route path="/" element={
          isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />
        } />
        <Route path="/news" element={
          isAuthenticated ? <NewsPage /> : <Navigate to="/login" />
        } />
        <Route path="/contacts" element={
          isAuthenticated ? <ContactsPage /> : <Navigate to="/login" />
        } />
      </Routes>
    </Router>
  );
}

export default App;
