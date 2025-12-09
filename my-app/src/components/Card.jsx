// Card.js
import React, { useEffect, useState, useRef } from "react";
import { useDispatchCart, useCart } from "./ContextReducer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Card(props) {
  console.log("Card props:", props); // debug

  let cart = useCart();
  let dispatch = useDispatchCart();

  const priceRef = useRef();

  const options = props.options || {}; // fallback to empty object
  const priceOptions = Object.keys(options); // will be [] if undefined

  console.log("Cart state:", cart); // debug
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState(() => {
    const firstOption = Object.keys(props.options || {})[0];
    return firstOption || "";
  });

  const finalPrice =
    (Number(qty) || 0) * (parseInt(options[size]) || 0);

  const handleAddToCart = async () => {
    await dispatch({
      type: "ADD",
      id: props.foodItem._id,
      name: props.foodItem.name,
      price: finalPrice,
      qty: qty,
      size: size,
    });

    // ✅ Toast notification
    toast.success(
      `${props.foodItem.name} (${size}, Qty: ${qty}) added to cart! 🛒`,
      {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }
    );
  };

  useEffect(() => {
    if (priceRef.current) {
      setSize(priceRef.current.value);
    }
  }, []);

  return (
    <div>
      <div
        className="card mt-3"
        style={{ width: "18rem", maxHeight: "480px" }}
      >
        <img
          src={props.foodItem.img}
          className="card-img-top"
          alt="food"
          style={{ height: "150px", objectFit: "fill" }}
        />
        <div className="card-body">
          <h5 className="card-title">{props.foodItem.name}</h5>
          <p className="card-text">{ }</p>
          <div className="container w-100">
            <select
              className="m-2 h-100 bg-success rounded"
              onChange={(e) => setQty(e.target.value)}
            >
              {Array.from(Array(6), (e, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            <select
              className="m-2 h-100 bg-success rounded"
              ref={priceRef}
              onChange={(e) => setSize(e.target.value)}
            >
              {priceOptions.length > 0 ? (
                priceOptions.map((data) => (
                  <option key={data} value={data}>
                    {data}
                  </option>
                ))
              ) : (
                <option disabled>No sizes</option>
              )}
            </select>
            <div className="d-inline h-100 fs-4">
              ₹/{finalPrice}-
            </div>
            <hr />
            <button
              className="btn btn-warning text-danger fw-bold px-4 py-2 shadow-sm rounded"
              onClick={handleAddToCart}
            >
              🛒 Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
