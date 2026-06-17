import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import Home from "./pages/Home";
import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";
import Cursor from "./components/Cursor";

export default function App() {
  return (
    <Router>
      {/* Global Custom Cursor */}
      <Cursor />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />
        <Route path="/sso-callback" element={<AuthenticateWithRedirectCallback signUpUrl="/sign-up" />} />
      </Routes>
    </Router>
  );
}
