import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function MyOrder() {
    const [orderData, setOrderData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('authToken');
        if (!token) {
            alert("Please login to view your orders.");
            navigate('/login');
            return;
        }
        
        fetchMyOrder();
    }, [navigate]);

    const fetchMyOrder = async () => {
        const email = localStorage.getItem('userEmail');

        try {
            const res = await fetch("http://localhost:5000/api/myOrderData", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const response = await res.json();

            if (response && response.orderData && Array.isArray(response.orderData.order_data)) {
                setOrderData([...response.orderData.order_data].reverse());
            } else {
                setOrderData([]);
            }
        } catch (err) {
            console.error("Error fetching orders:", err);
            setOrderData([]);
        }
    };

    return (
        <div>
            <Navbar />

            <div className='container'>
                <div className='row'>
                    {orderData.length > 0 ? (
                        orderData.map((orderGroup, index) => {
                            const orderDateObj = orderGroup.find(item => item.Order_date);
                            const items = orderGroup.filter(item => !item.Order_date);

                            return (
                                <React.Fragment key={index}>
                                    {orderDateObj && (
                                        <div className='m-auto mt-5'>
                                            <strong>{orderDateObj.Order_date}</strong>
                                            <hr />
                                        </div>
                                    )}

                                    {items.map((item, idx) => (
                                        <div className='col-12 col-md-6 col-lg-3' key={idx}>
                                            <div className="card mt-3" style={{ width: "16rem", maxHeight: "360px" }}>
                                                {/* Image removed */}
                                                {/* <img src={item.img} className="card-img-top" alt="..." style={{ height: "120px", objectFit: "fill" }} /> */}
                                                <div className="card-body">
                                                    <h5 className="card-title">{item.name}</h5>
                                                    <div className='container w-100 p-0' style={{ height: "38px" }}>
                                                        <span className='m-1'>{item.qty}</span>
                                                        <span className='m-1'>{item.size}</span>
                                                        <div className='d-inline ms-2 h-100 w-20 fs-5'>
                                                            ₹{item.price}/-
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </React.Fragment>
                            );
                        })
                    ) : (
                        <div className="text-center mt-5">No orders found.</div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}
