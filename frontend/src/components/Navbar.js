import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Menu, X, LogOut, LayoutDashboard, Home, BookOpen, Users, Award, Info } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'student':
        return '/student/dashboard';
      case 'teacher':
        return '/teacher/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/';
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <GraduationCap size={32} />
          <span>LearnHub</span>
        </Link>

        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
            <Home size={18} />
            <span>Home</span>
          </Link>
          <Link to="/why-students" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
            <Users size={18} />
            <span>Learner's Journey</span>
          </Link>
          <Link to="/why-teachers" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
            <Award size={18} />
            <span>Instructor's Academy</span>
          </Link>
          <Link to="/about" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
            <Info size={18} />
            <span>About</span>
          </Link>
          <Link to="/courses" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
            <BookOpen size={18} />
            <span>Courses</span>
          </Link>

          {isAuthenticated ? (
            <>
              <Link 
                to={getDashboardLink()} 
                className="navbar-btn-dashboard"
                onClick={() => setIsMenuOpen(false)}
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
              <button className="navbar-btn-logout" onClick={handleLogout}>
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-btn" onClick={() => setIsMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="navbar-btn-primary" onClick={() => setIsMenuOpen(false)}>
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button className="navbar-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
