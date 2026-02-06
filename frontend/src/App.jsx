import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CreatePost from './pages/CreatePost';
import Posts from './pages/Posts';
import Platforms from './pages/Platforms';
import { login, isAuthenticated } from './services/auth';

// Placeholder for Login/Register if we implement auth later
const Login = () => <div className="flex items-center justify-center h-screen">Login Page Placeholder</div>;

const AuthWrapper = ({ children }) => {
  const [isAuth, setIsAuth] = useState(isAuthenticated());

  useEffect(() => {
    const autoLogin = async () => {
      if (!isAuth) {
        try {
          console.log("Auto-logging in for dev...");
          await login('admin', 'adminpassword123');
          setIsAuth(true);
        } catch (e) {
          console.error("Auto-login failed", e);
        }
      }
    };
    autoLogin();
  }, [isAuth]);

  if (!isAuth) return <div className="flex h-screen items-center justify-center text-slate-500">Loading Dev Session...</div>;
  return children;
};

function App() {
  return (
    <Router>
      <AuthWrapper>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="posts" element={<Posts />} />
            <Route path="create" element={<CreatePost />} />
            <Route path="platforms" element={<Platforms />} />
            <Route path="settings" element={<div className="p-8">Settings Page Placeholder</div>} />
          </Route>
        </Routes>
      </AuthWrapper>
    </Router>
  );
}

export default App;
