import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

const stripePromise = loadStripe(
  "pk_test_51RRAh5GPSRL3syswxZgIPNG4LvgIKvIJJHHt9deNnuo9mXgr3eGEsfxRFj0aSEOEaHafvmuztny940xrucPDHUZ800we6crlp4"
);

createRoot(document.getElementById("root")).render(
  <Elements
    stripe={stripePromise}
  >
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </Elements>
);
