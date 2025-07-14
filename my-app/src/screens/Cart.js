import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete'; 
import '../CSS/Cart.css';
import { useCart, useDispatchCart } from '../components/ContextReducer';

const CartPage = () => {
  let data = useCart();
  let dispatch = useDispatchCart();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert(" Please login to access your cart.");
      navigate('/login');
    }
  }, [navigate]);

  // Checkout handler
  const handleCheckOut = async () => {
    const userEmail = localStorage.getItem("userEmail");

    const response = await fetch("http://localhost:5000/api/orderData", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        order_data: data,
        email: userEmail,
        order_date: new Date().toDateString()
      })
    });

    if (response.status === 200) {
      dispatch({ type: "CLEAR" });
      alert(" Order placed successfully!");
    } else {
      alert(" Failed to place order. Please try again.");
    }
  };

  // Total price calculation
  const totalPrice = data.reduce((total, item) => total + item.price, 0);

  // Empty cart message
  if (data.length === 0) {
    return (
      <div className='m-5 w-100 text-center fs-3'>
        🛒 The cart is empty
      </div>
    );
  }

  return (
    <div className='container mt-5'>
      <h2 className='text-center mb-4'>🛒 Your Cart</h2>

      <div className='table-responsive'>
        <table className='table table-hover'>
          <thead className='table-light text-success fs-5'>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Quantity</th>
              <th>Option</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <th>{index + 1}</th>
                <td>{item.name}</td>
                <td>{item.qty}</td>
                <td>{item.size}</td>
                <td> ₹{item.price}</td>
                <td>
                  <button
                    className="btn p-0 text-danger"
                    onClick={() => dispatch({ type: "REMOVE", index })}
                  >
                    <DeleteIcon />
                  </button>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan="4" className="text-end fw-bold">Total:</td>
              <td colSpan="2" className="fs-5">₹{totalPrice}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="text-center mt-4">
        <button className="btn btn-success px-4 py-2" onClick={handleCheckOut}>
           Check Out
        </button>
      </div>
    </div>
  );
};

export default CartPage;
