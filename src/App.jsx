import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthenticateWithRedirectCallback, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import Home from "./pages/Home";
import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
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
        
        {/* Protected Dashboard Route */}
        <Route 
          path="/dashboard" 
          element={
            <>
              <SignedIn>
                <Dashboard />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          } 
        />
      </Routes>
    </Router>
  );
}
