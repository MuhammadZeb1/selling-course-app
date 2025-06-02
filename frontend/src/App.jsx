import { Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import { Toaster } from 'react-hot-toast';
import Courses from './components/Courses';
import Purchases from './components/Purchases';
import Buy from './components/Buy';
import AdminSignup from './admin/AdminSignup';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import CourseCreate from './admin/CourseCreate';
import UpdateCourse from './admin/UpdateCourse';
import OurCourse from './admin/OurCourse';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

function App() {
  const { isLoggedIn, role } = useContext(AuthContext);

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/buy/:courseId" element={<Buy />} />

        {/* Protected User Route */}
        <Route
          path="/purchases"
          element={
            isLoggedIn && role === 'user' ? (
              <Purchases />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />
        <Route
          path="/admin/create-course"
          element={<CourseCreate />}
        />

        {/* Admin Course Update Route */}
        <Route
          path="/admin/update-courses/:courseId"
          element={<UpdateCourse />}
        />

        <Route
          path="/admin/our-courses"
          element={<OurCourse />}
        />
        
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
