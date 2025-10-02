import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import ManagerDashboard from './pages/ManagerDashboard';
import UsersList from './pages/UsersList';
import UserForm from './pages/UserForm';
import UserEdit from './pages/UserEdit';
import ProjectsList from './pages/ProjectsList';
import ProjectForm from './pages/ProjectForm';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
};

// Public Route Component (redirect if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return user ? <Navigate to="/dashboard" /> : children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <ManagerDashboard />
              </ProtectedRoute>
            } />
            
            {/* Legacy Routes (with navbar) */}
            <Route path="/" element={
              <div>
                {/* <PublicRoute> */}
                <Login />
              {/* </PublicRoute> */}
              </div>
            } />
            <Route path="/users" element={
              <div>
                <Navbar />
                <UsersList />
              </div>
            } />
            <Route path="/users/new" element={
              <div>
                <Navbar />
                <UserForm />
              </div>
            } />
            <Route path="/users/:id/edit" element={
              <div>
                <Navbar />
                <UserEdit />
              </div>
            } />
            <Route path="/projects" element={
              <div>
                <Navbar />
                <ProjectsList />
              </div>
            } />
            <Route path="/projects/new" element={
              <div>
                <Navbar />
                <ProjectForm />
              </div>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

