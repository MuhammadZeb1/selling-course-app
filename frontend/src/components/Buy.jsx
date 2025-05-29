import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

function Buy() {
  const { courseId } = useParams();
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState({});
  const [clientSecret, setClientSecret] = useState("");
  const [cardError, setCardError] = useState("");
  const [error, setError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(""); // <-- Added paymentSuccess state

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  console.log("token", token);
  const stripe = useStripe();
  const elements = useElements();
  console.log("clientSecret", clientSecret);
  console.log("course", course);
  // Auto-clear payment success message after 5 seconds
  useEffect(() => {
    if (paymentSuccess) {
      const timer = setTimeout(() => {
        setPaymentSuccess("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [paymentSuccess]);

  const fetchBuyCourseData = async () => {
    if (!token) {
      setError("Please login to purchase the course");
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/course/buy/course/${courseId}`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Use the token from localStorage
          },
        }
      );

      console.log("response", response.data);
      setClientSecret(response.data.clientSecret);
      setCourse(response.data.course);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error.response?.status === 400) {
        setError(
          error.response.data.message ||
            "you have already purchased this course"
        );
        navigate("/purchases");
      } else {
        setError(error.response.data.error || "Purchase failed");
      }
    }
  };

  useEffect(() => {
    fetchBuyCourseData();
  }, [courseId]);

  const handlePurchase = async (event) => {
    // Block native form submission.
    event.preventDefault();

    if (!stripe || !elements) {
      console.log("stripe or elements not found");
      return;
    }

    setLoading(false);
    const card = elements.getElement(CardElement);

    if (card == null) {
      console.log("card not found");
      setLoading(false);
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      console.log("stripe method Error", error);
      setLoading(false);
      setCardError(error.message);
      setPaymentSuccess(""); // clear success on error
    } else {
      console.log("[PaymentMethod created]", paymentMethod);
      setCardError(""); // clear any previous card error
    }

    if (!clientSecret) {
      console.log("clientSecret not found");
      setLoading(false);
      return;
    }

    const { paymentIntent, error: confirmError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            name: localStorage.getItem("name") || "User",
            email: localStorage.getItem("email"),
          },
        },
      });

    if (confirmError) {
      console.log("confirmError", confirmError);
      setCardError(confirmError.message);
      setPaymentSuccess(""); // clear success on error
    } else if (paymentIntent.status === "succeeded") {
      console.log("paymentIntent", paymentIntent);
      setPaymentSuccess(
        `Payment successful! Your payment ID: ${paymentIntent.id}`
      ); // <-- use paymentSuccess here
      setCardError(""); // clear errors on success
    }

    const paymentInfo = {
      email: localStorage.getItem("email"),
      courseId: courseId,
      paymentId: paymentIntent?.id,
      amount: paymentIntent?.amount,
      status: paymentIntent?.status,
    };

    console.log("payment", paymentInfo);
    await axios
      .post("http://localhost:3000/api/v1/order/", paymentInfo, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    setLoading(false);
    navigate("/purchases");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-900 rounded-lg shadow-lg border border-gray-700 p-8">
        <h1 className="text-4xl font-extrabold text-white mb-8 text-center tracking-wide">
          Purchase Course
        </h1>

        {/* Loading */}
        {loading && (
          <div className="mb-6 text-center text-indigo-400 font-semibold">
            Processing your request...
          </div>
        )}

        {/* General Error */}
        {error && (
          <div className="mb-6 bg-red-700 text-red-100 p-4 rounded-md text-center font-medium animate-pulse">
            {error}
          </div>
        )}

        {/* Payment Success */}
        {paymentSuccess && (
          <div className="mb-6 bg-green-700 text-green-100 p-4 rounded-md text-center font-semibold">
            {paymentSuccess}
          </div>
        )}

        {/* Course Info */}
        <div className="mb-8 text-center text-white">
          <h2 className="text-3xl font-semibold mb-2">
            {course.title || "Course Title"}
          </h2>
          <p className="text-gray-400 mb-3">
            {course.description || "Course description will appear here."}
          </p>
          <p className="text-xl font-bold">Price: ${course.price || "N/A"}</p>
        </div>

        {/* Payment Form */}
        <form onSubmit={handlePurchase} className="space-y-6">
          <label
            className="block text-white font-semibold mb-2"
            htmlFor="card-element"
          >
            Card Details
          </label>
          <div className="p-4 bg-gray-800 rounded border border-gray-700">
            <CardElement
              id="card-element"
              options={{
                hidePostalCode: true,
                style: {
                  base: {
                    color: "#f9fafb",
                    fontSize: "16px",
                    fontWeight: "500",
                    "::placeholder": {
                      color: "#9ca3af",
                    },
                  },
                  invalid: {
                    color: "#f87171",
                  },
                },
              }}
            />
          </div>

          {/* Card Errors */}
          {cardError && (
            <p className="text-red-500 font-medium text-center">{cardError}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-md font-semibold text-white transition-colors ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Processing..." : `Pay $${course.price || ""}`}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Buy;
