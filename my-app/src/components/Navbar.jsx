import React, { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { Badge } from 'react-bootstrap';
import LocationMap from './LocationMap';
import { useCart } from './ContextReducer';

export default function Navbar() {

    const navigate =useNavigate();
    const [showLocation, setShowLocation] = useState(false);
    const cartData = useCart();

    const handlelogout = ()=>{
        localStorage.removeItem("authToken");
        localStorage.removeItem("userEmail");
        navigate("/login")
    }
     const handleCart = () => {
     if (localStorage.getItem("authToken")) {
      navigate("/Cart");
      } else {
      // Optional: Redirect to login or show a message
      alert("Please log in to access your cart.");
     }
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-success">
                <div className="container-fluid">
                    <Link className="navbar-brand fs-1 fst-italic" to="/">GoFood</Link> 
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link active" to="/">Home</Link>
                            </li>
                            {(localStorage.getItem("authToken"))?
                            <li className="nav-item">
                                <Link className="nav-link active" to="/MyOrder">my Orders</Link>
                            </li> :""}
                           
                            
                        </ul>
                        {(!localStorage.getItem("authToken"))?
                        <div className='d-flex'>
                            <Link className="btn bg-white text-success mx-1" to="/login">Login</Link>
                            <Link className="btn bg-white text-success mx-1" to="/createuser">SignUp</Link>
                            <button className="btn bg-white text-info mx-1" onClick={() => setShowLocation(!showLocation)}>📍 Location</button>
                        </div>
                        :
                        <>
                        <button className="btn bg-white text-info mx-2" onClick={() => setShowLocation(!showLocation)}>📍 Location</button>
                        <div className='btn bg-white text-success mx-2' onClick={handleCart}>
                            My Cart {" "}
                            <Badge pill bg='danger'>{cartData.length}</Badge>
                        </div>
                        <div className='btn bg-white text-danger mx-2' onClick={handlelogout}>Logout</div>
                        </>
                        }

                    </div>
                </div>
            </nav>

            {showLocation && (
                <div style={{
                    position: 'fixed',
                    top: '80px',
                    right: '20px',
                    width: '450px',
                    maxHeight: '600px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                    zIndex: 1000,
                    overflow: 'auto'
                }}>
                    <button 
                        onClick={() => setShowLocation(false)}
                        style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            background: 'none',
                            border: 'none',
                            fontSize: '20px',
                            cursor: 'pointer',
                            color: '#666'
                        }}
                    >
                        ✕
                    </button>
                    <LocationMap />
                </div>
            )}
        </div>
    );
}
