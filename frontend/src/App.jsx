import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LogProblem from './pages/LogProblem';
import Problems from './pages/Problems';
import GitHub from './pages/GitHub';

// redirect to login if not logged in
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/log" element={<PrivateRoute><LogProblem /></PrivateRoute>} />
          <Route path="/problems" element={<PrivateRoute><Problems /></PrivateRoute>} />
          <Route path="/github" element={<PrivateRoute><GitHub /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
