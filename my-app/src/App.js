import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './screens/Home';
import Login from './screens/Login';
import Signup from './screens/Signup';
import CartPage from './screens/Cart';
import MyOrder from './screens/MyOrder';


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
          <Route path="/Cart" element={<CartPage/>}/>
          <Route exact path="/myorder" element={<MyOrder />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
