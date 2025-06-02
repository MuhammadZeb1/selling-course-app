import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
function UpdateCourse() {
  const { isLoggedIn, role, token } = useContext(AuthContext);
  const { courseId } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:3000/api/v1/course/${courseId}`,
        {
          withCredentials: true,
        }
      );
      console.log("Course:", data.course);
      setTitle(data.course.title);
      setDescription(data.course.description);
      setPrice(data.course.price);
      setImagePreview(data.course.image.url);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching course data:", error);
      toast.error("Failed to fetch course data");
    }
  };
  useEffect(() => {
    getData();
  }, [courseId]);
  const changePhotoHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setImage(file);
    };
  };

  const handlerUpdateCourse = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    if (image && imagePreview && !imagePreview.startsWith("https")) {
      formData.append("image", image);
    }

    if (!isLoggedIn || role !== "admin") {
      toast.error("You are not authorized to update a course");
      console.log("Please login to admin");
      navigate("/admin/login");
      return;
    }
    try {
      const response = await axios.put(
        `http://localhost:3000/api/v1/course/update/${courseId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      toast.success(response.data.message || "Course updated successfully");
      navigate("/admin/our-courses");
      setTitle("");
      setDescription("");
      setPrice("");
      setImage(null);
      setImagePreview(null);
    } catch (error) {
      console.log("error", error);
      toast.error(error.response.data.message || "Course update failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-200 px-1">
      <form
        onSubmit={handlerUpdateCourse}
        className="bg-white shadow-md rounded-xl px-8 py-2 w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Update Course
        </h2>

        <div className="mb-3">
          <label className="block mb-1 font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your course title"
            className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-3">
          <label className="block mb-1 font-medium text-gray-700">
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter your course description"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-3">
          <label className="block mb-1 font-medium text-gray-700">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter your course price"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-3">
          <label className="block mb-1 font-medium text-gray-700">
            Course Image
          </label>
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Course"
              className="w-full h-40 object-cover rounded-md mb-2 border"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={changePhotoHandler}
            className="w-full px-2 py-1 border rounded-lg"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
          onClick={handlerUpdateCourse}
        >
          {loading ? "Updating..." : "Update Course"}
        </button>
      </form>
    </div>
  );
}

export default UpdateCourse;
