import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import ErrorBoundary from './components/ErrorBoundary';
import PublicLayout from './layouts/PublicLayout';
import ResponderLayout from './layouts/ResponderLayout';
import WarRoom from './pages/Admin/WarRoom';
import Dashboard from './pages/Public/Dashboard';
import LoginPage from './pages/Auth/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastProvider } from './context/ToastContext';
import ToastContainer from './components/UI/ToastContainer';

function App() {
  return (
    <ToastProvider>
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
              <ErrorBoundary>
                <AdminLayout />
              </ErrorBoundary>
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
        <ToastContainer />
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
