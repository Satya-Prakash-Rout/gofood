// App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './screens/Home';
import Login from './screens/Login';
import Signup from './screens/Signup';
import CartPage from './screens/Cart';
import MyOrder from './screens/MyOrder';
import { ToastContainer } from "react-toastify";

import 'react-toastify/dist/ReactToastify.css'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { CartProvider } from './components/ContextReducer';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/createuser" element={<Signup />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/myorder" element={<MyOrder />} />
        </Routes>

        
        <ToastContainer />
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
