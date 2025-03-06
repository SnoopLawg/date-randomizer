import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css'
import Home from './pages/Home'
import About from './pages/About'
import NotFound from './pages/NotFound';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import { useEffect } from 'react';
import NearbyPlaces from './components/NearbyPlaces';

function App() {
  const { isAuthenticated } = useAuth();

  // Example of using a macrotask (setTimeout)
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('App fully loaded and authenticated status:', isAuthenticated);
    }, 2000);

    // Cleanup
    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  return (
    <>
      <Navbar />
      <div className="container-fluid px-4">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/nearby-places/:dateIdea" element={<NearbyPlaces />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            {/* Add other protected routes here */}
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
