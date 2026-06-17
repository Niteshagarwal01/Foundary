import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthenticateWithRedirectCallback, SignedIn, SignedOut } from "@clerk/clerk-react";
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
        <Route 
          path="/sso-callback" 
          element={
            <div className="min-h-screen bg-[#080808] flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-[#C9A355] border-t-transparent rounded-full animate-spin" />
              <AuthenticateWithRedirectCallback signUpUrl="/sign-up" />
            </div>
          } 
        />
        
        {/* Protected Dashboard Route */}
        <Route 
          path="/dashboard" 
          element={
            <>
              <SignedIn>
                <Dashboard />
              </SignedIn>
              <SignedOut>
                <Navigate to="/sign-in" replace />
              </SignedOut>
            </>
          } 
        />
      </Routes>
    </Router>
  );
}
