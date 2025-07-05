import React from 'react';

export default function Card() {
    return (
        <div>
            <div className="card mt-3" style={{ width: "18rem", maxHeight: "480px" }}>
                <img src="https://pickyeaterblog.com/wp-content/uploads/2012/01/indian-samosas-recipe-1.jpg" className="card-img-top" alt="..." / >
                <div className="card-body">
                    <h5 className="card-title">Card title</h5>
                    <p className="card-text">This is some important text.</p>
                    <div className='container w-100'>
                        <select className='m-2 h-100  bg-success'>
                            {Array.from(Array(6), (e, i) => (
                                <option key={i + 1} value={i + 1}>
                                    {i + 1}
                                </option>
                            ))}
                        </select>
                        <select className='m-2 h-100 bg-success rounded'>
                            <option value="half">half</option>
                            <option value="full">full</option>
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
