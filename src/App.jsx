import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import VerificationPage from './pages/VerificationPage';
import DashboardPage from './pages/DashboardPage';
import FormPage from './pages/FormPage';
import ConfirmationPage from './pages/ConfirmationPage';

function RequireAuth({ children }) {
  const user = localStorage.getItem('cursed_user');
  return user ? children : <Navigate to="/login" replace />;
}

function RequireVerified({ children }) {
  const verified = localStorage.getItem('cursed_verified');
  const user = localStorage.getItem('cursed_user');
  if (!user) return <Navigate to="/login" replace />;
  if (!verified) return <Navigate to="/verify" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify" element={<RequireAuth><VerificationPage /></RequireAuth>} />
        <Route path="/dashboard" element={<RequireVerified><DashboardPage /></RequireVerified>} />
        <Route path="/form" element={<RequireVerified><FormPage /></RequireVerified>} />
        <Route path="/confirmation" element={<RequireVerified><ConfirmationPage /></RequireVerified>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
