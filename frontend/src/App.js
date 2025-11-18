import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import WhyTeachers from './pages/WhyTeachers';
import WhyStudents from './pages/WhyStudents';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CoursesPage from './pages/CoursesPage';
import CourseDetail from './pages/CourseDetail';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <div style={{ flex: '1' }}>
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/why-teachers" element={<WhyTeachers />} />
            <Route path="/why-students" element={<WhyStudents />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route 
              path="/student/dashboard" 
              element={
                <PrivateRoute role="student">
                  <StudentDashboard />
                </PrivateRoute>
              } 
            />
            
            <Route 
              path="/teacher/dashboard" 
              element={
                <PrivateRoute role="teacher">
                  <TeacherDashboard />
                </PrivateRoute>
              } 
            />
            
            <Route 
              path="/admin/dashboard" 
              element={
                <PrivateRoute role="admin">
                  <AdminDashboard />
                </PrivateRoute>
              } 
            />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
