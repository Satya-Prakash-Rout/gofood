// Home.js

import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Card from '../components/Card';

export default function Home() {
  const [search, setsearch] = useState('');
  const [foodCat, setfoodCat] = useState([]);
  const [foodItem, setfoodItem] = useState([]);

  const loadData = async () => {
    let response = await fetch("http://localhost:5000/api/foodData", {
      method: "POST",
      headers: {
        "Content-Type": 'application/json'
      }
    });
    response = await response.json();

    setfoodItem(response[0]);
    setfoodCat(response[1]);
    console.log(response[0], response[1]); // debug
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <div>
        <Navbar />
      </div>
      <div>
        <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
          <div className="position-absolute w-100 d-flex justify-content-center align-items-center" style={{ top: '20%', zIndex: 2 }}>
            <form className="d-flex w-50" role="search">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
                value={search} // ✅ controlled input
                onChange={(e) => setsearch(e.target.value)} // ✅ update state
                style={{ boxShadow: '0 0 10px rgba(0,0,0,0.3)' }}
              />

              
            </form>
          </div>
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src="https://assets.epicurious.com/photos/5c745a108918ee7ab68daf79/1%3A1/w_2560%2Cc_limit/Smashburger-recipe-120219.jpg" className="d-block w-100" alt="..." style={{ height: "400px", objectFit: "cover" }} />
            </div>
            <div className="carousel-item">
              <img src="https://www.thecuriouschickpea.com/wp-content/uploads/2018/12/Tibetan-Veggie-Momos-1.jpg" className="d-block w-100" alt="..." style={{ height: "400px", objectFit: "cover" }} />
            </div>
            <div className="carousel-item">
              <img src="https://www.cubesnjuliennes.com/wp-content/uploads/2020/08/Best-Indian-Punjabi-Samosa-Recipe.jpg" className="d-block w-100" alt="..." style={{ height: "400px", objectFit: "cover" }} />
            </div>
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>

      </div>

      <div className='container my-4'>
        {
          foodCat.length > 0
            ? foodCat.map((category) => {
              const items = foodItem.filter(
                item =>
                  item.CategoryName === category.CategoryName &&
                  item.name.toLowerCase().includes(search.toLowerCase())
              );

              return (
                <div key={category._id}>
                  <div className='fs-3 m-3'>{category.CategoryName}</div>
                  <hr />
                  <div className='row'>
                    {
                      items.length > 0
                        ? items.map((item) => (
                          <div key={item._id} className='col-12 col-sm-6 col-md-4 col-lg-3 mb-4'>
                            <Card
                              foodName={item.name}
                              options={item.options[0]}
                              imgSrc={item.img}
                              des={item.description}
                            />
                          </div>
                        ))
                        : <div className='col-12 text-muted mb-3'>No items found in this category.</div>
                    }
                  </div>
                </div>
              );
            })
            : <div>Loading categories...</div>
        }
      </div>

      <div>
        <Footer />
      </div>
    </>
  );
}
