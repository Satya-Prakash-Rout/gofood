// card.js
import React,{useState} from 'react';
import { useDispatchCart , useCart} from './ContextReducer';



export default function Card(props) {
    console.log("Card props:", props); //debug
   
    const cart = useCart();  
    let dispatch = useDispatchCart();


    const options = props.options || {}; // fallback to empty object
    const priceOptions = Object.keys(options); // will be [] if undefined
    
    console.log('Cart state:', cart);//debug
    const [qty,setQty] = useState(1);
    const [size,setSize] = useState("");
    const handleAddToCart = async () => {
        await dispatch({type:"ADD",id:props.foodItem._id,name:props.foodItem.name,price:props.finalPrice,qty:qty,size:size})
        console.log(cart);//debug
    }

    let finalPrice = qty* parseInt(options[size]);
    return (
        <div>
            <div className="card mt-3" style={{ width: "18rem", maxHeight: "480px" }}>
                <img src={props.foodItem.img} className="card-img-top" alt="food" style={{ height: "150px", objectFit: "fill" }} />
                <div className="card-body">
                    <h5 className="card-title">{props.foodItem.name}</h5>
                    <p className="card-text">{ }</p>
                    <div className='container w-100'>
                        <select className='m-2 h-100  bg-success rounded' onChange={(e)=>setSize(e.target.value)}>
                            {Array.from(Array(6), (e, i) => (
                                <option key={i + 1} value={i + 1}>
                                    {i + 1}
                                </option>
                            ))}
                        </select>
                        <select className='m-2 h-100 bg-success rounded' onChange={(e)=>setSize(e.target.value)}>
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
                        <div className='d-inline h-100 fs-4'>
                            {finalPrice}
                        </div>
                        <hr></hr>
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
    )
}
