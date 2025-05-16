import React, { useEffect, useState } from "react";
import book from "../assets/bookbook-logo.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [errormessage, seterrormessage] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if (errormessage) {
      const timer = setTimeout(() => {
        seterrormessage("");
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [errormessage]);

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  console.log(
    formData.firstName,
    formData.lastName,
    formData.email,
    formData.password
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/user/singup",
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
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
      console.log("signup successfully!",response.data);
      toast.success("signup successfully!");
      navigate("/login");
    }  catch (error) {
      if (error.response) {
        if (error.response.data.message) {
          toast.success(error.response.data.message);
    }

    if (error.response.data.errors) {
      // alert(error.response.data.errors[0]); // صرف پہلا error دکھائیں
      console.error("Error request:", error.request);
    }
    
    seterrormessage(error.response.data.errors?.[0] || "Signup failed");
  }
  
  console.error("Error during signup:", error);
}


    // Handle form submission here

    console.log(formData);
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
            to="/login"
            className="px-4 py-2 bg-transparent border border-blue-500 text-white rounded hover:bg-blue-500 hover:text-white transition duration-300"
          >
            Login
          </Link>
          <Link
            to="/courses"
            className="px-4 py-2 bg-transparent border border-blue-500 text-white rounded hover:bg-blue-500 hover:text-white transition duration-300"
          >
            join now
          </Link>
        </div>
      </header>

      {/* Simple Signup Form */}
      <div className="flex items-center justify-center p-3">
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-700">
          <h2 className="text-2xl font-bold mb-1 text-center text-white">
            Signup
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <div>
              <label className="block text-gray-300 mb-1" htmlFor="firstname">
                Firstname
              </label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-3 py-2 hover:scale-y-105 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-transform"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-1" htmlFor="lastname">
                Lastname
              </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-3 py-2 hover:scale-y-105 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-transform"
                required
              />
            </div>

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
              />
            </div>
            {
              errormessage && (
                <div className="text-red-500 text-center">
                  {errormessage}
                </div>
              ) 
            }

            <button
              type="submit"
              className="w-full hover:scale-y-105 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-300 font-medium mt-4"
            >
              Signup
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
