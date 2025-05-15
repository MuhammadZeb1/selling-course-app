import book from "../assets/bookbook-logo.png";
import { Link } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import { CiLinkedin } from "react-icons/ci";
import { FaGithub } from "react-icons/fa";
import axios from "axios";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Home() {
  const [course, setcourse] = useState([]);
  const getCourse = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/course/courses",
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
      setcourse(response.data.courses);
    } catch (error) {
      console.log("error the fetch getCourse", error);
    }
  };
  useEffect(() => {
    getCourse();
  }, []);
  console.log(course);

  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <>
      <div className="gradient bg-gradient-to-r from-[#000000] to-blue-950 h-min-screen ">
        <div className=" container mx-auto  flex  flex-col gap-9">
          <header className="flex justify-between items-center p-4 ">
            <div className="flex items-center gap-3 text-white">
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
                to="/signup"
                className="px-4 py-2 bg-transparent border border-blue-500 text-white rounded hover:bg-blue-500 hover:text-white transition duration-300"
              >
                Signup
              </Link>
            </div>
          </header>
          <section className="flex flex-col items-center justify-center text-center text-white space-y-6 ">
            <h1 className="text-4xl font-semibold tracking-wide">
              CourseHaven
            </h1>
            <p className="text-lg max-w-md mx-auto">
              Lorem ipsum dolor sit amet consectetur adipisicin, esse!
            </p>
            <div className="flex gap-4">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-green-700 transition duration-300">
                Explore Courses
              </button>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-green-700 transition duration-300">
                Courses Video
              </button>
            </div>
          </section>
          <section className="text-white ">
            <Slider {...settings}>
              {course.map((item) => (
                <div key={item._id} className="p-6 w-full ">
                  <div className="relative transition duration-300 transform hover:scale-105 rounded-lg bg-gray-900 shadow-md">
                    {/* Image on top */}
                    <div className="overflow-hidden rounded-t-lg">
                      <img
                        className="h-40 w-full object-contain"
                        src={item.image?.url.replace("http://", "https://")}
                        alt="Course Image"
                      />
                    </div>

                    {/* Title below image */}
                    <h2 className="text-xl font-semibold text-center mt-4">
                      {item.title}
                    </h2>

                    {/* Button below title */}
                    <div className="flex justify-center mt-3 mb-6">
                      <button className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition">
                        Enroll now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </section>
          <hr className="border border-gray-300" />
          <footer>
            <div className="grid grid-cols-1 md:grid-cols-3 text-white p-4 gap-4">
              <div>
                <div className="flex items-center gap-3 text-white">
                  <img
                    src={book}
                    alt="Logo"
                    className="h-10 w-10 rounded-full"
                  />
                  <h1>CourseHaven</h1>
                </div>
                <p className="mt-3">Follow us</p>

                <div className="flex flex-col gap-2 mt-4">
                  <div className="flex gap-4">
                    <a
                      href="https://wa.me/923001234567?text=Hi%20I%20am%20interested%20in%20your%20services"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-500 hover:text-red-700  text-xl transition duration-300 ease-in-out"
                    >
                      <FaWhatsapp />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/muhammad-zeb-3a8a032b1/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-red-700  text-xl transition duration-300 ease-in-out"
                    >
                      <CiLinkedin />
                    </a>
                    <a
                      href="https://github.com/MuhammadZeb1"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-red-700 text-xl transition duration-300 ease-in-out"
                    >
                      <FaGithub />
                    </a>
                  </div>
                </div>
              </div>
              <div className="text-center gap-4 flex flex-col">
                <h1 className="text-lg text-semi-bold">connects</h1>
                <ul className="space-y-2">
                  <li className="text-gray-400 hover:text-white">github</li>
                  <li className="text-gray-400 hover:text-white">
                    03329610945
                  </li>
                  <li className="text-gray-400 hover:text-white">whats app</li>
                </ul>
              </div>
              <div className="text-right">
                <div className="text-center gap-4 flex flex-col">
                  <h1 className="text-lg text-semi-bold">copyrights © 2025 </h1>
                  <ul className="space-y-2">
                    <li className="text-gray-400 hover:text-white">
                      Terms & condtion
                    </li>
                    <li className="text-gray-400 hover:text-white">
                      privcy policy
                    </li>
                    <li className="text-gray-400 hover:text-white">
                      Refund $ Cancellation
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}

export default Home;
