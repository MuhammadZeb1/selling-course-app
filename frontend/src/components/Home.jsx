import book from "../assets/bookbook-logo.png";
import { Link, useNavigate } from "react-router-dom";
import { FaWhatsapp, FaGithub } from "react-icons/fa";
import { CiLinkedin } from "react-icons/ci";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext"; // ✅ import context

function Home() {
  const [course, setCourse] = useState([]);
  const navigate = useNavigate();

  // ✅ use context
  const { isLoggedIn, logout } = useContext(AuthContext);
  console.log(isLoggedIn);

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:3000/api/v1/user/logout", {
        withCredentials: true,
      });

      logout(); // ✅ use context logout
      toast.success("Logout successfully!");
      navigate("/");
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
    } catch (error) {
      console.log("Error fetching courses", error);
      if (error.response?.status === 401) {
        logout(); // ✅ also logout if unauthorized
      }
    }
  };

  useEffect(() => {
    getCourse();
  }, []);

  const settings = {
    dots: true,
    infinite: false,
    speed: 1000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3, slidesToScroll: 3, infinite: true, dots: true },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 2, slidesToScroll: 2, initialSlide: 2 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1, slidesToScroll: 1 },
      },
    ],
  };

  return (
    <div className="bg-gradient-to-r from-black to-blue-950 min-h-screen text-white">
      <div className="container mx-auto p-4">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <img src={book} alt="Logo" className="h-10 w-10 rounded-full" />
            <h1 className="text-xl font-semibold">CourseHaven</h1>
          </div>
          <div className="flex gap-4">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-blue-500 text-white rounded hover:bg-blue-500 transition"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 border border-blue-500 rounded hover:bg-blue-500 transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 border border-blue-500 rounded hover:bg-blue-500 transition"
                >
                  Signup
                </Link>
              </>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <section className="text-center space-y-6 mb-12">
          <h1 className="text-4xl font-bold">CourseHaven</h1>
          <p className="text-lg max-w-md mx-auto">
            Learn from the best courses available online. Enroll now to grow your skills.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/courses" className="px-6 py-3 bg-blue-600 rounded hover:bg-green-700 transition">
              Explore Courses
            </Link>
            <Link to="https://www.youtube.com/results?search_query=mern+stack+react+node+mongodb+express" className="px-6 py-3 bg-blue-600 rounded hover:bg-green-700 transition">
              Course Videos
            </Link>
          </div>
        </section>

        {/* Courses Carousel */}
        <section className="mb-12">
          <Slider {...settings}>
            {course.map((item) => (
              <div key={item._id} className="p-4">
                <div className="bg-gray-900 rounded-lg shadow-lg hover:scale-105 transition-transform">
                  <img
                    className="h-40 w-full object-contain rounded-t-lg"
                    src={item.image?.url.replace("http://", "https://")}
                    alt={item.title}
                  />
                  <h2 className="text-xl font-semibold text-center mt-4">{item.title}</h2>
                  <div className="flex justify-center mt-3 mb-6">
                    <button className="px-4 py-2 bg-orange-500 rounded hover:bg-orange-600 transition">
                      Enroll now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </section>

        <hr className="border-gray-600 mb-6" />

        {/* Footer */}
        <footer className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <img src={book} alt="Logo" className="h-10 w-10 rounded-full" />
              <h1 className="text-lg">CourseHaven</h1>
            </div>
            <p>Follow us</p>
            <div className="flex gap-4 mt-2 text-xl">
              <a href="https://wa.me/923001234567" target="_blank" className="text-green-500">
                <FaWhatsapp />
              </a>
              <a href="https://linkedin.com/in/muhammad-zeb-3a8a032b1" target="_blank" className="text-blue-400">
                <CiLinkedin />
              </a>
              <a href="https://github.com/MuhammadZeb1" target="_blank" className="text-white">
                <FaGithub />
              </a>
            </div>
          </div>
          <div className="text-center">
            <h2 className="font-semibold mb-2">Connect</h2>
            <ul className="space-y-1 text-gray-400">
              <li>GitHub</li>
              <li>0332-9610945</li>
              <li>WhatsApp</li>
            </ul>
          </div>
          <div className="text-right">
            <h2 className="font-semibold mb-2">© 2025</h2>
            <ul className="space-y-1 text-gray-400">
              <li>Terms & Conditions</li>
              <li>Privacy Policy</li>
              <li>Refund & Cancellation</li>
            </ul>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Home;
