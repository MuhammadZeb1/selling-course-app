import { Link } from 'react-router-dom';
import logo from '../../src/assets/bookbook-logo.png'

function AdminDashboard() {
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-4 flex flex-col justify-start">
        <img src={logo} alt="logo" className="h-14 w-14 rounded-full mb-4 mx-auto" />
        <div className="text-center mb-6 font-bold text-xl text-gray-800">I'm Admin</div>

        <div className="space-y-4">
          {/* Matches: /admin/our-courses */}
          <Link
            to="/admin/our-courses"
            className="block text-center bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Our Courses
          </Link>

          {/* Matches: /admin/create-course */}
          <Link
            to="/admin/create-course"
            className="block text-center bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
          >
            Create Course
          </Link>

          {/* Home (you can define it as needed; if admin home is /admin/dashboard) */}
          <Link
            to="/"
            className="block text-center bg-red-500 text-white py-2 rounded hover:bg-red-600"
          >
            Home
          </Link>

          {/* Logout – assuming logout logic handled via navigation or context */}
          <Link
            to="/admin/login"
            className="block text-center bg-yellow-400 text-white py-2 rounded hover:bg-yellow-500"
          >
            Logout
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center">
        <h1 className="text-xl font-bold text-gray-700">Welcome!!!</h1>
      </div>
    </div>
  );
}

export default AdminDashboard;
