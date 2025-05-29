import React, { useState, useEffect } from "react";
import book from "../assets/bookbook-logo.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import toast from "react-hot-toast";

function Login() {
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errormessage, seterrormessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (errormessage) {
      const timer = setTimeout(() => {
        seterrormessage("");
      }, 3000); // Increased timeout to 3 seconds for better UX

      return () => clearTimeout(timer);
    }
  }, [errormessage]);

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/user/login",
        {
          email: formData.email,
          password: formData.password,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
     
      
      console.log("Login successful!", response.data);
      toast.success("Login successful!");
      
      
      localStorage.setItem("email", response.data.user.email);
      console.log("User email stored in localStorage:", response.data.user.email);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      
      login(response.data.token);
      console.log("User logged in:", response.data.user);
      

      navigate("/");
    } catch (error) {
      console.error("Login error:", error);

      if (error.response) {
        console.error("Server response:", error.response.data);
        if (error.response.status === 500) {
          seterrormessage("Server error - please try again later");
        } else {
          seterrormessage(
            error.response.data.error ||
              error.response.data.message ||
              "Login failed. Please check your credentials."
          );
        }
      } else if (error.request) {
        seterrormessage("Network error - please check your connection");
      } else {
        seterrormessage("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-[#000000] to-blue-950 min-h-screen">
      <header className="flex justify-between items-center p-1">
        <div className="flex items-center gap-2 text-white">
          <img src={book} alt="Logo" className="h-10 w-10 rounded-full" />
          <h1>CourseHaven</h1>
        </div>
        <div className="flex gap-4">
          <Link
            to="/signup"
            className="px-4 py-2 bg-transparent border border-blue-500 text-white rounded hover:bg-blue-500 hover:text-white transition duration-300"
          >
            Signup
          </Link>
          <Link
            to="/courses"
            className="px-4 py-2 bg-transparent border border-blue-500 text-white rounded hover:bg-blue-500 hover:text-white transition duration-300"
          >
            Join now
          </Link>
        </div>
      </header>

      <div className="flex items-center justify-center p-3">
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-700">
          <h2 className="text-2xl font-bold mb-1 text-center text-white">
            Login
          </h2>
          <p className="text-center text-white font-bold mt-2">
            Login to access the paid courses
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <div>
              <label className="block text-gray-300 mb-1" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 hover:scale-y-105 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-transform"
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 hover:scale-y-105 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-transform"
                required
                disabled={isSubmitting}
              />
            </div>

            {errormessage && (
              <div className="text-red-500 text-center mt-2 animate-pulse">
                {errormessage}
              </div>
            )}

            <button
              type="submit"
              className={`w-full hover:scale-y-105 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-300 font-medium mt-4 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
