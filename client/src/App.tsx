import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { Analyze } from './pages/Analyze';
import { Results } from './pages/Results';
import { History } from './pages/History';
import { Insights } from './pages/Insights';
import { HowItWorks } from './pages/HowItWorks';
import { Settings } from './pages/Settings';
import { Privacy } from './pages/Privacy';
import { Layout } from './components/Layout';

export function App() {
  const [scanlinesActive, setScanlinesActive] = useState(false);

  const toggleScanlines = () => {
    setScanlinesActive(prev => !prev);
  };

  useEffect(() => {
    localStorage.removeItem('gaplens_openrouter_api_key');
    localStorage.removeItem('gaplens_openrouter_model');
    localStorage.removeItem('gaplens_theme');
    document.documentElement.removeAttribute('data-theme');
    delete document.documentElement.dataset.theme;
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing Page without fixed sidebar */}
        <Route path="/" element={<Landing />} />

        {/* Intelligence Application Suite with Cyberpunk Layout */}
        <Route
          element={
            <Layout
              scanlinesActive={scanlinesActive}
              onToggleScanlines={toggleScanlines}
            />
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/results/:id" element={<Results />} />
          <Route path="/history" element={<History />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/privacy" element={<Privacy />} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
