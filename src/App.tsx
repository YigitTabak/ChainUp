import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { AuthGuard, OnboardingGuard } from './components/Guards/Guards';
import Landing from './pages/Landing/Landing';
import Onboarding from './pages/Onboarding/Onboarding';
import Dashboard from './pages/Dashboard/Dashboard';
import History from './pages/History/History';
import Letter from './pages/Letter/Letter';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Routes>
            <Route path="/" element={<Landing />} />

            <Route
              path="/onboarding"
              element={
                <OnboardingGuard>
                  <Onboarding />
                </OnboardingGuard>
              }
            />

            <Route
              path="/dashboard"
              element={
                <AuthGuard>
                  <Dashboard />
                </AuthGuard>
              }
            />

            <Route
              path="/history"
              element={
                <AuthGuard>
                  <History />
                </AuthGuard>
              }
            />

            <Route
              path="/letter"
              element={
                <AuthGuard>
                  <Letter />
                </AuthGuard>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
