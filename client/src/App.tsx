import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import PublicLayout from './layouts/PublicLayout';
import ResponderLayout from './layouts/ResponderLayout';
import WarRoom from './pages/Admin/WarRoom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<WarRoom />} />
        </Route>

        {/* Responder Routes */}
        <Route path="/responder" element={<ResponderLayout />} />

        {/* Redirects */}
        <Route path="/dashboard" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
