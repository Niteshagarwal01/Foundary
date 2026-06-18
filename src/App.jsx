import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth, AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import ExplorePage from "./pages/Explore";
import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";
import ResetPassword from "./pages/ResetPassword";
import Cursor from "./components/Cursor";
import { CartProvider } from "./context/AppContext";
import CartDrawer from "./components/CartDrawer";
import AIChatWidget from "./components/AIChatWidget";

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
          <AIChatWidget />
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/sign-up" element={<SignUpPage />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/checkout" element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } />

            {/* Protected Dashboard Route */}
            <Route 
              path="/vault" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />

            {/* Catch-all for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
