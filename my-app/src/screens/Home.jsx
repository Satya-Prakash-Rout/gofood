import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Card from '../components/Card';
import { API_BASE_URL, SOCKET_URL } from '../config';

export default function Home() {
  const [search, setSearch] = useState('');
  const [foodCat, setFoodCat] = useState([]);
  const [foodItem, setFoodItem] = useState([]);
  const [carouselImages, setCarouselImages] = useState([]);
  const location = useLocation();

  // Load food data and carousel images
  const loadData = async () => {
    try {
      const foodRes = await fetch(`${API_BASE_URL}/api/foodData`, {
        method: "POST",
        headers: {
          "Content-Type": 'application/json'
        }
      });

      if (!foodRes.ok) throw new Error(`HTTP error! status: ${foodRes.status}`);

      const data = await foodRes.json();
      const normalizedFoodItems = Array.isArray(data[0]) ? data[0] : [];
      const normalizedCategories = Array.isArray(data[1]) && data[1].length > 0
        ? data[1]
        : [...new Set(
            normalizedFoodItems
              .filter(item => item.CategoryName)
              .map(item => item.CategoryName.trim())
          )].map((CategoryName, index) => ({ _id: `fallback-${index}`, CategoryName }));

      setFoodItem(normalizedFoodItems);
      setFoodCat(normalizedCategories);

      // Fetch 3 dynamic food images from Foodish API (use a reliable endpoint and fall back to static images)
      const imagePromises = Array.from({ length: 3 }, () =>
        fetch("https://foodish-api.herokuapp.com/api/").then(res => {
          if (!res.ok) throw new Error(`Image fetch failed: ${res.status}`);
          return res.json();
        })
      );

      let images = [];
      try {
        const results = await Promise.all(imagePromises);
        images = results.map(img => img.image).filter(Boolean);
      } catch (imgErr) {
        console.error("Failed to fetch carousel images, using fallback images:", imgErr);
        // Fallback images (Unsplash) to ensure the carousel still shows visuals
        images = [
          "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1200&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1651440204296-a79fa9988007?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        ];
      }

      setCarouselImages(images);

    } catch (error) {
      console.error("Failed to load data:", error);
    }
  };

  useEffect(() => {
    loadData();

    // Initialize Socket.IO connection
    const socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    // Listen for new food items added
    socket.on('foodAdded', (data) => {
      console.log('New food item added via Socket.IO:', data);
      if (data.success && data.food) {
        // Reload data when new item is added
        loadData();
      }
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, [location]);

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
      <div className='container my-4 bg-light p-3 rounded'>

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
