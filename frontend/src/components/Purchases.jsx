import axios from "axios";
import book from "../assets/bookbook-logo.png";
import { Link, useNavigate } from "react-router-dom";
import { FaWhatsapp, FaGithub, FaHome, FaDiscourse } from "react-icons/fa";
import { CiLinkedin, CiSaveDown2, CiSearch } from "react-icons/ci";
import { IoIosSettings } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { Navigate } from "react-router-dom";

import toast from "react-hot-toast";
import React, { useEffect, useState } from "react";


function Purchases() {
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState(null);
 
  

  // ✅ Check if user is logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    if (parsedUser?.token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // ✅ Logout function
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

  // ✅ Get purchases
  const getCourse = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/user/purchase",
        { withCredentials: true }
      );
      console.log("Purchases response:", response.data);
      setPurchases(response.data.purchases); // ✅ Correct key from backend
    } catch (error) {
      console.log("Error fetching purchases", error);
      if (error.response?.status === 401) {
        setError("Unauthorized access. Please log in.");
      } else {
        setError("Something went wrong while fetching purchases.");
      }
    }
  };

  // ✅ Fetch courses on mount
  useEffect(() => {
    getCourse();
  }, []);

  // Dummy handler for now
  const handleBuy = (id) => {
    toast.success("Purchase functionality not implemented.");
  };

  return (
  <>
    <div className="p-4 bg-gray-50 overflow-y-auto flex">
      <div className="w-2/10 bg-white border-r shadow-md p-6 min-h-screen flex flex-col items-center gap-6 ">
        <img src={book} alt="logo" className="h-14 w-14 rounded-full" />
        <nav className="w-full flex flex-col gap-2">
          <Link to="/" className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded">
            <FaHome /> <span>Home</span>
          </Link>
          <Link to="/courses" className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded">
            <FaDiscourse /> <span>Courses</span>
          </Link>
          <Link to="/purchases" className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded">
            <CiSaveDown2 /> <span>Purchases</span>
          </Link>
          <Link to="/settings" className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded">
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

      {/* Main content */}
      <div className="grid grid-cols-3 gap-4 p-6 w-full">
        {/* Show error if any */}
        {error && (
          <div className="text-red-500 text-center mb-4">{error}</div>
        )}

        {/* Show purchases */}
        {purchases.length === 0 ? (
          <p>No purchases found.</p>
        ) : (
          purchases.map((purchase) => (
            <div
              key={purchase._id}
              className="border rounded h-70   mb-4 shadow-md flex flex-col gap-6 items-center"
            >
              <img
                src={purchase.image?.url}
                alt={purchase.title}
                className="h-40 rounded w-70 "
              />
              <div>
                <h2 className="text-xl font-semibold">{purchase.title}</h2>
                <p className="text-gray-600">{purchase.description}</p>
                <p className="mt-2 font-bold text-green-600">
                  Price: ${purchase.price.toLocaleString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  </>
);

}

export default Purchases;
