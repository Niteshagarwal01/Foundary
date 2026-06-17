import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth, AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Cursor from "./components/Cursor";
import { CartProvider } from "./context/AppContext";
import CartDrawer from "./components/CartDrawer";

const ProtectedRoute = ({ children }) => {
  const { session, loading } = useAuth();
  
  if (loading) return null; // Or a loading spinner
  
  if (!session) {
    return <Navigate to="/sign-in" replace />;
  }

  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          {/* Global Custom Cursor */}
          <Cursor />
          <CartDrawer />
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sign-in/*" element={<SignInPage />} />
            <Route path="/sign-up/*" element={<SignUpPage />} />

            {/* Protected Dashboard Route */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
