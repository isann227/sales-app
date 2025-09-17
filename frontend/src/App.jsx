import { useContext } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider, AuthContext } from "./Context/AuthContext";
import Home from './Pages/Home';
import About from './Pages/About';
import Product from './Pages/Product';
import Collections from './Pages/Collections';
import Contact from './Pages/Contact';
import Orders from './Pages/Orders';
import Placeorder from './Pages/Placeorder';
import Cart from './Pages/Cart';
import NavBar from "./Components/NavBar";
import Footer from "./Components/Footer";
import SearchBar from "./Components/SearchBar";
import { ToastContainer } from 'react-toastify';
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import ProtectedRoute from "./Components/ProtectedRoute";
import GuestRoute from "./Components/GuestRoute";

function AppRoutes() {
  const { loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <div>Loading...</div>;
  const hideNav = location.pathname.startsWith("/dashboard");

  return (
    <>
      {!hideNav && <NavBar />}
      {!hideNav && <SearchBar />}
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Collections" element={<Collections />} />
        <Route path="/About" element={<About />} />
        <Route path="/products/:id" element={<Product />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/Orders" element={<Orders />} />
        <Route path="/Placeorder" element={<Placeorder />} />
        <Route path="/Contact" element={<Contact />} />

        <Route path="/login" element={ <GuestRoute> <Login /> </GuestRoute>} />
        <Route path="/register" element={<GuestRoute> <Register /></GuestRoute>} />

        {/* proteksi role USER biar tetap di ecommerce */}
        <Route element={<ProtectedRoute roles={["USER"]} />}>
          <Route path="/orders" element={<Orders />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/placeorder" element={<Placeorder />} />
        </Route>

        {/* proteksi dashboard hanya ADMIN, SUPERADMIN, dan RESELLER */}
        <Route element={<ProtectedRoute roles={["ADMIN", "SUPERADMIN", "RESELLER","KURIR"]} />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route path="/unauthorized" element={<div className="p-4">Unauthorized</div>} />
        <Route path="*" element={<div className="p-4">Not Found</div>} />
      </Routes>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
