// card.js
import React from 'react';


export default function Card(props) { 
    console.log("Card props:", props); //debug
    


    const options = props.options || {}; // fallback to empty object
    const priceOptions = Object.keys(options); // will be [] if undefined

    return (
        <div>
            <div className="card mt-3" style={{ width: "18rem", maxHeight: "480px" }}>
                <img src={props.imgSrc} className="card-img-top" alt="food" style={{height:"150px",objectFit:"fill"}} / >
                <div className="card-body">
                    <h5 className="card-title">{props.foodName}</h5>
                    <p className="card-text">{}</p>
                    <div className='container w-100'>
                        <select className='m-2 h-100  bg-success'>
                            {Array.from(Array(6), (e, i) => (
                                <option key={i + 1} value={i + 1}>
                                    {i + 1}
                                </option>
                            ))}
                        </select>
                        <select className='m-2 h-100 bg-success rounded'>
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
                            Total Price
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
