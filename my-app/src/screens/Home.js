import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Card from '../components/Card';

export default function Home() {
  const [search, setSearch] = useState('');
  const [foodCat, setFoodCat] = useState([]);
  const [foodItem, setFoodItem] = useState([]);
  const [carouselImages, setCarouselImages] = useState([]);

  // Load food data and carousel images
  const loadData = async () => {
    try {
      const foodRes = await fetch("http://localhost:5000/api/foodData", {
        method: "POST",
        headers: {
          "Content-Type": 'application/json'
        }
      });

      if (!foodRes.ok) throw new Error(`HTTP error! status: ${foodRes.status}`);

      const data = await foodRes.json();
      setFoodItem(data[0]);
      setFoodCat(data[1]);

      // Fetch 3 dynamic food images from Foodish API
      const imagePromises = Array.from({ length: 3 }, () =>
        fetch("https://foodish-api.com/api/").then(res => res.json())
      );

      const images = await Promise.all(imagePromises);
      setCarouselImages(images.map(img => img.image));

    } catch (error) {
      console.error("Failed to load data:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <Navbar />

      {/* Dynamic Carousel with Search Bar */}
      <div className="position-relative">
        <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
          {/* Search bar overlay */}
          <div className="position-absolute w-100 d-flex justify-content-center align-items-center" style={{ top: '20%', zIndex: 2 }}>
            <form className="d-flex w-50">
              <input
                type="search"
                className="form-control shadow"
                placeholder="Search for food..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>
          </div>

          <div className="carousel-inner">
            {carouselImages.length > 0 ? (
              carouselImages.map((imgUrl, idx) => (
                <div className={`carousel-item ${idx === 0 ? 'active' : ''}`} key={idx}>
                  <div className="carousel-dark-overlay position-relative">
                    <img
                      src={imgUrl}
                      className="d-block w-100"
                      alt={`food-${idx}`}
                      style={{
                        height: "400px",
                        objectFit: "cover",
                        filter: "brightness(50%)"
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="carousel-item active">
                <div style={{ height: "400px", backgroundColor: "#333" }} />
              </div>
            )}
          </div>

          {/* Carousel controls */}
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

      {/* Food Display Section */}
      <div className='container my-4'>
        {
          foodCat.length > 0 ? (
            foodCat.map((category) => {
              const items = foodItem.filter(
                item =>
                  item.CategoryName === category.CategoryName &&
                  item.name.toLowerCase().includes(search.toLowerCase())
              );

              return (
                <div key={category._id}>
                  <h3 className='m-3'>{category.CategoryName}</h3>
                  <hr />
                  <div className='row'>
                    {
                      items.length > 0 ? (
                        items.map((item) => (
                          <div key={item._id} className='col-12 col-sm-6 col-md-4 col-lg-3 mb-4'>
                            <Card foodItem={item} options={item.options[0]} />
                          </div>
                        ))
                      ) : (
                        <div className='col-12 text-muted mb-3'>
                          No items found in this category.
                        </div>
                      )
                    }
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-muted">Loading categories...</div>
          )
        }
      </div>

      <Footer />
    </>
  );
}
