import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Card from '../components/Card';

export default function Home() {
  // Search input state
  const [search, setSearch] = useState('');

  // State to store food categories (e.g., Pizza, Burger, etc.)
  const [foodCat, setFoodCat] = useState([]);

  // State to store all food items (e.g., Chicken Pizza, Veg Burger, etc.)
  const [foodItem, setFoodItem] = useState([]);

  // Fetch food data from backend
  const loadData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/foodData", {
        method: "POST",
        headers: {
          "Content-Type": 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Response is expected to be [foodItems, foodCategories]
      setFoodItem(data[0]);
      setFoodCat(data[1]);

      console.log("Food Items:", data[0]);   // Debug: show food items
      console.log("Food Categories:", data[1]); // Debug: show categories
    } catch (error) {
      console.error("Failed to fetch food data:", error);
    }
  };

  // Run loadData() once when component mounts
  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      {/* Navigation Bar */}
      <Navbar />

      {/* Image Carousel with Search Bar */}
      <div>
        <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
          {/* Search bar on top of carousel */}
          <div
            className="position-absolute w-100 d-flex justify-content-center align-items-center"
            style={{ top: '20%', zIndex: 2 }}
          >
            <form className="d-flex w-50" role="search">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)} // update state on input
                style={{ boxShadow: '0 0 10px rgba(0,0,0,0.3)' }}
              />
            </form>
          </div>

          {/* Carousel images */}
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img
                src="https://assets.epicurious.com/photos/5c745a108918ee7ab68daf79/1%3A1/w_2560%2Cc_limit/Smashburger-recipe-120219.jpg"
                className="d-block w-100"
                alt="burger"
                style={{ height: "400px", objectFit: "cover" }}
              />
            </div>
            <div className="carousel-item">
              <img
                src="https://www.thecuriouschickpea.com/wp-content/uploads/2018/12/Tibetan-Veggie-Momos-1.jpg"
                className="d-block w-100"
                alt="momos"
                style={{ height: "400px", objectFit: "cover" }}
              />
            </div>
            <div className="carousel-item">
              <img
                src="https://www.cubesnjuliennes.com/wp-content/uploads/2020/08/Best-Indian-Punjabi-Samosa-Recipe.jpg"
                className="d-block w-100"
                alt="samosa"
                style={{ height: "400px", objectFit: "cover" }}
              />
            </div>
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

      {/* Main food display section */}
      <div className='container my-4'>
        {
          foodCat.length > 0
            ? (
              // Loop through each category
              foodCat.map((category) => {
                // Filter food items that belong to the current category and match the search query
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
                                foodItem={item} // ✅ Pass individual item
                                options={item.options[0]} // ✅ Pass options object
                              />
                            </div>
                          ))
                          : (
                            <div className='col-12 text-muted mb-3'>
                              No items found in this category.
                            </div>
                          )
                      }
                    </div>
                  </div>
                );
              })
            )
            : (
              // If no categories loaded yet
              <div>Loading categories...</div>
            )
        }
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
}
