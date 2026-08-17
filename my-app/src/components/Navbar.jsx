import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "react-bootstrap";
import LocationMap from "./LocationMap";
import { useCart } from "./ContextReducer";

export default function Navbar() {
    const navigate = useNavigate();
    const [showLocation, setShowLocation] = useState(false);

    const cartData = useCart();
    const isLoggedIn = Boolean(localStorage.getItem("authToken"));

    // Logout
    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userEmail");
        navigate("/login");
    };

    // Cart
    const handleCart = () => {
        if (localStorage.getItem("authToken")) {
            navigate("/Cart");
        } else {
            alert("Please log in to access your cart.");
        }
    };

    // Toggle location
    const toggleLocation = () => {
        setShowLocation((prev) => !prev);
    };

    return (
        <div>
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-success">
                <div className="container-fluid">

                    {/* Logo */}
                    <Link
                        className="navbar-brand fs-1 fst-italic"
                        to="/"
                    >
                        GoFood
                    </Link>

                    {/* Mobile Toggle */}
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    {/* Navbar Content */}
                    <div
                        className="collapse navbar-collapse"
                        id="navbarSupportedContent"
                    >

                        {/* Left Side Navigation */}
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">

                            <li className="nav-item">
                                <Link
                                    className="nav-link active"
                                    to="/"
                                >
                                    Home
                                </Link>
                            </li>

                            {isLoggedIn && (
                                <li className="nav-item">
                                    <Link
                                        className="nav-link active"
                                        to="/MyOrder"
                                    >
                                        My Orders
                                    </Link>
                                </li>
                            )}

                        </ul>

                        {/* Right Side */}
                        <div className="d-flex align-items-center justify-content-center gap-2">

                            {/* Location */}
                            <button
                                type="button"
                                className="btn bg-white text-info"
                                onClick={toggleLocation}
                            >
                                📍 Location
                            </button>

                            {!isLoggedIn ? (
                                <>
                                    {/* Login */}
                                    <Link
                                        className="btn btn-danger"
                                        to="/login"
                                    >
                                        Login
                                    </Link>

                                    {/* Sign Up */}
                                    <Link
                                        className="btn btn-danger"
                                        to="/createuser"
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            ) : (
                                <>
                                    {/* Cart */}
                                    <button
                                        type="button"
                                        className="btn bg-white text-success"
                                        onClick={handleCart}
                                    >
                                        My Cart{" "}
                                        <Badge pill bg="danger">
                                            {cartData.length}
                                        </Badge>
                                    </button>

                                    {/* Logout */}
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </>
                            )}

                        </div>
                    </div>
                </div>
            </nav>

            {/* Location Popup */}
            {showLocation && (
                <div
                    style={{
                        position: "fixed",
                        top: "80px",
                        right: "20px",
                        width: "450px",
                        maxWidth: "calc(100vw - 40px)",
                        maxHeight: "600px",
                        backgroundColor: "white",
                        borderRadius: "8px",
                        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                        zIndex: 1050,
                        overflow: "auto",
                    }}
                >
                    {/* Close Button */}
                    <button
                        type="button"
                        onClick={() => setShowLocation(false)}
                        style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            background: "white",
                            border: "none",
                            borderRadius: "50%",
                            width: "32px",
                            height: "32px",
                            fontSize: "18px",
                            cursor: "pointer",
                            color: "#666",
                            zIndex: 1060,
                        }}
                        aria-label="Close location"
                    >
                        ✕
                    </button>

                    {/* Map */}
                    <LocationMap />
                </div>
            )}
        </div>
    );
}