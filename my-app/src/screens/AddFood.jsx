import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../CSS/AddFood.css';

export default function AddFood() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    CategoryName: '',
    description: '',
    halfPrice: '',
    fullPrice: '',
    imgUrl: ''
  });
  const [loading, setLoading] = useState(false);

  // Food categories from database
  const categories = [
    'Starter',
    'Pizza',
    'Biryani/Rice',
    'Breakfast',
    'Lunch',
    'Dinner',
    'Snacks',
    'Desserts',
    'Chicken',
    'Beverages'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim() || !formData.CategoryName || !formData.halfPrice || !formData.fullPrice || !formData.imgUrl.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const halfPrice = parseFloat(formData.halfPrice);
    const fullPrice = parseFloat(formData.fullPrice);

    if (isNaN(halfPrice) || halfPrice <= 0 || isNaN(fullPrice) || fullPrice <= 0) {
      toast.error('Prices must be valid positive numbers');
      return;
    }

    if (fullPrice <= halfPrice) {
      toast.error('Full price must be greater than half price');
      return;
    }

    setLoading(true);

    try {
      // Send as JSON instead of FormData
      const response = await fetch('process.env.REACT_APP_API_URL/api/addfood', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          CategoryName: formData.CategoryName.trim(),
          description: formData.description.trim(),
          halfPrice: formData.halfPrice,
          fullPrice: formData.fullPrice,
          imgUrl: formData.imgUrl.trim()
        })
      });

      const responseData = await response.json();

      if (response.ok) {
        toast.success('Food item added successfully!');
        setFormData({
          name: '',
          CategoryName: '',
          description: '',
          halfPrice: '',
          fullPrice: '',
          imgUrl: ''
        });
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        toast.error(responseData.error || 'Failed to add food item');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="add-food-container">
        <div className="add-food-wrapper">
          <h2>Add New Food Item</h2>
          
          <form onSubmit={handleSubmit} className="add-food-form">
            <div className="form-group">
              <label htmlFor="name">Food Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter food name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="CategoryName">Category *</label>
              <select
                id="CategoryName"
                name="CategoryName"
                value={formData.CategoryName}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter food description (optional)"
                rows="4"
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="halfPrice">Half Price (₹) *</label>
              <input
                type="number"
                id="halfPrice"
                name="halfPrice"
                value={formData.halfPrice}
                onChange={handleChange}
                placeholder="Enter half portion price"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="fullPrice">Full Price (₹) *</label>
              <input
                type="number"
                id="fullPrice"
                name="fullPrice"
                value={formData.fullPrice}
                onChange={handleChange}
                placeholder="Enter full portion price"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="imgUrl">Image URL *</label>
              <input
                type="url"
                id="imgUrl"
                name="imgUrl"
                value={formData.imgUrl}
                onChange={handleChange}
                placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                required
              />
              <small>Provide a valid image URL. The image will be displayed from the provided URL.</small>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add Food Item'}
              </button>
              <button
                type="button"
                className="btn btn-cancel"
                onClick={() => navigate('/')}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
