import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

function OurCourse() {
  const [course, setCourse] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getCourse = async () => {
    const admin = JSON.parse(localStorage.getItem("admin"));
    const token = admin?.token;

    if (!token) {
      console.log("Please login to admin");
      navigate("/admin/login");
      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/course/courses",
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCourse(response.data.courses);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching courses", error);
      toast.error("Failed to fetch courses");
    }
  };

  const deleteCourse = async (id) => {
    const admin = JSON.parse(localStorage.getItem("admin"));
    const token = admin?.token;

    if (!token) {
      toast.error("Please login to admin");
      navigate("/admin/login");
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/api/v1/course/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      toast.success("Course deleted successfully");
      const updatedCourses = course.filter((c) => c._id !== id);
      setCourse(updatedCourses);
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error(error.response.data.message || "Failed to delete course");
    }
  };

  useEffect(() => {
    getCourse();
  }, []);
 

  return (
    <div className="bg-gray-100 min-h-screen p-5">
      <h2 className="text-3xl font-bold text-center mb-6">Our Courses</h2>
      <div className="flex justify-start">
         <Link
        to="/admin/dashboard"
        className="text-gray-700  hover:scale-105 mb-4 block text-center font-bold border border-gray-950 rounded px-4 py-2 transition-transform duration-200 hover:bg-gray-200 hover:text-gray-900"
      >
      go to dashboard
      </Link>
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Loading courses...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {course.map((course) => (
            <div
              key={course._id}
              className="bg-white shadow-md rounded-lg overflow-hidden border"
            >
              <img
                src={course?.image?.url}
                alt={course.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold mb-1">{course.title}</h3>
                <p className="text-gray-700 mb-2 text-sm">
                  {course.description}
                </p>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-gray-900">
                    <span className="line-through text-red-500 mr-1">
                      ₹{course.originalPrice}
                    </span>
                    <span className="font-semibold">
                      ₹{course.discountedPrice}
                    </span>
                  </div>
                  <div className="text-green-600 text-sm font-bold">
                    {course.discountPercent}% off
                  </div>
                </div>
                <div className="flex justify-between">
                  <Link
                    className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 transition"
                   
                    to={`/admin/update-courses/${course._id}`}
                  >
                    Update
                  </Link>
                  <Link
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    onClick={() => deleteCourse(course._id)}
                  >
                    Delete
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OurCourse;
