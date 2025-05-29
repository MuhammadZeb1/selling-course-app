import book from "../assets/bookbook-logo.png";
import { Link } from "react-router-dom";
import { FaWhatsapp, FaGithub, FaHome, FaDiscourse } from "react-icons/fa";
import { CiLinkedin, CiSaveDown2, CiSearch } from "react-icons/ci";
import { IoIosSettings } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function Courses() {
  const [course, setCourse] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("user");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:3000/api/v1/user/logout", {
        withCredentials: true,
      });
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      toast.success("Logout successfully!");
    } catch (error) {
      console.error("Logout error:", error);
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Logout failed. Please try again.";
      toast.error(errorMessage);
    }
  };

  const getCourse = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/course/courses",
        { withCredentials: true }
      );
      setCourse(response.data.courses);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching courses", error);
    }
  };

  useEffect(() => {
    getCourse();
  }, []);

  const handleBuy = (id) => {
    // Add your logic for course purchase
    toast.success("Purchase functionality not implemented.");
  };

  return (
    <div className="flex h-screen overflow-hidden gap-4">
      {/* Sidebar */}
      <div className="w-1/6 bg-white border-r shadow-md p-4 flex flex-col items-center gap-6">
        <img src={book} alt="logo" className="h-14 w-14 rounded-full" />
        <nav className="w-full flex flex-col gap-2">
          <Link
            to="/"
            className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded"
          >
            <FaHome /> <span>Home</span>
          </Link>
          <Link
            to="/courses"
            className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded"
          >
            <FaDiscourse /> <span>Courses</span>
          </Link>
          <Link
            to="/purchases"
            className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded"
          >
            <CiSaveDown2 /> <span>Purchases</span>
          </Link>
          <Link
            to="/settings"
            className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded"
          >
            <IoIosSettings /> <span>Settings</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded text-left w-full"
          >
            <IoLogOut /> <span>Logout</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="w-5/6 p-6 bg-gray-50 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Available Courses</h1>
          <div className="flex items-center border border-gray-300 rounded-full overflow-hidden">
            <input
              type="text"
              className="px-4 py-1 outline-none text-sm"
              placeholder="Search courses..."
            />
            <button className="px-4 bg-white">
              <CiSearch className="text-lg" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p>Loading...</p>
          ) : (
            course.map((item) => (
              <div
                key={item._id}
                className="relative bg-white rounded-xl shadow hover:shadow-lg p-4 transition duration-300"
              >
                <div className="border border-gray-200 rounded-lg mb-4">
                  <img
                    src={item.image?.url}
                    alt={item.title}
                    className="w-full max-h-75 object-cover rounded-lg mb-4"
                  />
                </div>
                <div>
                  <h2 className="text-lg font-semibold mb-1 line-clamp-1">
                    {item.title}
                  </h2>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-2 mb-4">
                    <p className="text-black font-bold text-base">
                      ₹{item.price}
                    </p>
                    <p className="line-through text-gray-400 text-sm">
                      ₹{item.originalPrice}
                    </p>
                    <p className="text-green-600 text-sm font-medium">
                      {item.discount}% off
                    </p>
                  </div>
                  <Link
                    to={`/buy/${item._id}`}
                    className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 text-center block"
                  >
                    Buy Now
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Courses;
