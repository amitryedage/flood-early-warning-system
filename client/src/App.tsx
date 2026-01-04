import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import PublicLayout from './layouts/PublicLayout';
import ResponderLayout from './layouts/ResponderLayout';
import WarRoom from './pages/Admin/WarRoom';
import Dashboard from './pages/Public/Dashboard';
import LoginPage from './pages/Auth/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute requireRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<WarRoom />} />
        </Route>

        {/* Responder Routes */}
        <Route path="/responder" element={
          <ProtectedRoute requireRole="responder">
            <ResponderLayout />
          </ProtectedRoute>
        } />

        {/* Redirects */}
        <Route path="/dashboard" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
