import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './AdminDashboard.css';

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [activeTab, setActiveTab] = useState('add-food');
  const [formData, setFormData] = useState({
    name: '',
    CategoryName: '',
    description: '',
    halfPrice: '',
    fullPrice: '',
    imgUrl: ''
  });
  const [foodItems, setFoodItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [todayOrders, setTodayOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const categories = [
    'Starter',
    'Pizza',
    'Biryani/Rice',
    'Breakfast',
    'Lunch',
    'Dinner',
    'Snacks',
    'Desserts',
    'Beverages'
  ];

  useEffect(() => {
    // Verify admin token
    const token = localStorage.getItem('adminToken');
    const adminData = localStorage.getItem('adminData');

    if (!token || !adminData) {
      navigate('/admin/login');
      return;
    }

    setAdmin(JSON.parse(adminData));
    loadFoodItems();
  }, [navigate]);

  const loadFoodItems = async () => {
    try {
      const response = await fetch('process.env.REACT_APP_API_URL/api/foodData', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      setFoodItems(data[0] || []);
    } catch (error) {
      console.error('Error loading food items:', error);
    }
  };

  // Helper function to flatten order_data if it's nested
  const flattenOrderData = (orderData) => {
    if (!orderData || !Array.isArray(orderData)) return [];
    // Check if first element is an array (nested structure)
    if (orderData.length > 0 && Array.isArray(orderData[0])) {
      // Flatten nested array structure
      return orderData.flat();
    }
    // Already flat array
    return orderData;
  };

  const loadOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const response = await fetch('process.env.REACT_APP_API_URL/api/admin/allOrders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        const allOrders = data.orders || [];
        // Flatten order_data for each order if needed
        const processedOrders = allOrders.map(order => ({
          ...order,
          order_data: flattenOrderData(order.order_data)
        }));
        setOrders(processedOrders);
        
        // Filter today's orders
        const today = new Date().toDateString();
        const filteredTodayOrders = processedOrders.filter(order => order.order_date === today);
        setTodayOrders(filteredTodayOrders);
      } else {
        toast.error('Failed to load orders');
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Server error loading orders');
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'view-orders') {
      loadOrders();
    }
  }, [activeTab, loadOrders]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddFood = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.name.trim() || !formData.CategoryName || !formData.halfPrice || !formData.fullPrice || !formData.imgUrl.trim()) {
        toast.error('Please fill in all required fields');
        setLoading(false);
        return;
      }

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

      const data = await response.json();

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
        loadFoodItems();
      } else {
        toast.error(data.error || 'Failed to add food item');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Server error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFood = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const response = await fetch(`process.env.REACT_APP_API_URL/api/deletefood/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });

        if (response.ok) {
          toast.success('Food item deleted');
          loadFoodItems();
        } else {
          toast.error('Failed to delete item');
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Server error');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    navigate('/login');
    toast.success('Logged out successfully');
  };

  if (!admin) {
    return <div className="admin-loading">Loading...</div>;
  }

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-profile">
          <h3>👨‍💼 {admin.name}</h3>
          <p>{admin.email}</p>
          <span className="admin-badge">{admin.role}</span>
        </div>

        <nav className="admin-nav">
          <button
            className={`nav-item ${activeTab === 'add-food' ? 'active' : ''}`}
            onClick={() => setActiveTab('add-food')}
          >
            ➕ Add Food Item
          </button>
          <button
            className={`nav-item ${activeTab === 'manage-food' ? 'active' : ''}`}
            onClick={() => setActiveTab('manage-food')}
          >
            📋 Manage Items ({foodItems.length})
          </button>
          <button
            className={`nav-item ${activeTab === 'view-orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('view-orders')}
          >
            📦 View Orders ({orders.length})
          </button>
        </nav>

        <button className="btn-logout" onClick={handleLogout}>
          🚪 Logout
        </button>
      </aside>

      <main className="admin-content">
        <header className="admin-header">
          <h1>🛡️ Admin Dashboard</h1>
          <p>Welcome back, {admin.name}!</p>
        </header>

        {activeTab === 'add-food' && (
          <section className="admin-section">
            <h2>Add New Food Item</h2>
            <form onSubmit={handleAddFood} className="admin-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Food Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Chilli Paneer"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    name="CategoryName"
                    value={formData.CategoryName}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Add food description..."
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Half Price (₹) *</label>
                  <input
                    type="number"
                    name="halfPrice"
                    value={formData.halfPrice}
                    onChange={handleChange}
                    placeholder="e.g., 120"
                    step="0.01"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Full Price (₹) *</label>
                  <input
                    type="number"
                    name="fullPrice"
                    value={formData.fullPrice}
                    onChange={handleChange}
                    placeholder="e.g., 200"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Image URL *</label>
                <input
                  type="url"
                  name="imgUrl"
                  value={formData.imgUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Adding...' : '➕ Add Food Item'}
              </button>
            </form>
          </section>
        )}

        {activeTab === 'manage-food' && (
          <section className="admin-section">
            <h2>Manage Food Items</h2>
            <div className="food-items-grid">
              {foodItems.length > 0 ? (
                foodItems.map((item, index) => (
                  <div key={index} className="food-item-card">
                    <img src={item.img} alt={item.name} />
                    <div className="food-item-details">
                      <h4>{item.name}</h4>
                      <p className="category">{item.CategoryName}</p>
                      {item.options && item.options[0] && (
                        <div className="prices">
                          <span>Half: ₹{item.options[0].half}</span>
                          <span>Full: ₹{item.options[0].full}</span>
                        </div>
                      )}
                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteFood(item._id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-items">No food items found</p>
              )}
            </div>
          </section>
        )}

        {activeTab === 'view-orders' && (
          <section className="admin-section">
            <h2>📦 Customer Orders with Location</h2>

            {/* Today's Orders Section */}
            {!ordersLoading && todayOrders.length > 0 && (
              <div className="today-orders-section">
                <h3>📅 Today's Orders ({todayOrders.length})</h3>
                <div className="today-orders-summary">
                  <div className="orders-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Customer Email</th>
                          <th>Items (Qty × Price = Total)</th>
                          <th>Order Date</th>
                          <th>📍 Location Details</th>
                          <th className="action-column">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {todayOrders.map((order, index) => {
                          const calculateOrderTotal = (orderData) => {
                            if (!orderData || !Array.isArray(orderData)) return 0;
                            return orderData.reduce((total, item) => {
                              const qty = parseInt(item.qty) || 0;
                              const price = parseFloat(item.price) || 0;
                              return total + (qty * price);
                            }, 0);
                          };
                          const orderTotal = calculateOrderTotal(order.order_data);
                          
                          return (
                            <tr key={`today-${order._id || index}`}>
                              <td>{order.email}</td>
                              <td>
                                <div className="order-items">
                                  {order.order_data && order.order_data.length > 0 ? (
                                    <ul>
                                      {order.order_data.map((item, idx) => {
                                        const qty = parseInt(item.qty) || 0;
                                        const price = parseFloat(item.price) || 0;
                                        const itemTotal = qty * price;
                                        return (
                                          <li key={idx}>
                                            {item.name} ({qty} × ₹{price} = ₹{itemTotal.toFixed(2)})
                                          </li>
                                        );
                                      })}
                                      <li className="order-total">
                                        <strong>Order Total: ₹{orderTotal.toFixed(2)}</strong>
                                      </li>
                                    </ul>
                                  ) : (
                                    <span>No items</span>
                                  )}
                                </div>
                              </td>
                              <td>{order.order_date}</td>
                              <td>
                                {order.location && order.location.latitude ? (
                                  <div className="location-info">
                                    <p><strong>Lat:</strong> {order.location.latitude.toFixed(4)}</p>
                                    <p><strong>Lng:</strong> {order.location.longitude.toFixed(4)}</p>
                                    <p><strong>Address:</strong> {order.location.address || 'N/A'}</p>
                                  </div>
                                ) : (
                                  <span className="no-location">No location</span>
                                )}
                              </td>
                              <td className="action-column">
                                <button 
                                  onClick={() => setSelectedOrder(order)}
                                  className="btn-view-map"
                                  title="View on map"
                                >
                                  🗺️
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* All Orders Section */}
            <div style={{ marginTop: todayOrders.length > 0 ? '40px' : '0' }}>
              <h3>📋 All Orders ({orders.length})</h3>
              {ordersLoading ? (
                <div className="loading">Loading orders...</div>
              ) : orders.length > 0 ? (
                <div className="orders-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Customer Email</th>
                        <th>Items (Qty × Price = Total)</th>
                        <th>Order Date</th>
                        <th>📍 Location Details</th>
                        <th className="action-column">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order, index) => {
                        const calculateOrderTotal = (orderData) => {
                          if (!orderData || !Array.isArray(orderData)) return 0;
                          return orderData.reduce((total, item) => {
                            const qty = parseInt(item.qty) || 0;
                            const price = parseFloat(item.price) || 0;
                            return total + (qty * price);
                          }, 0);
                        };
                        const orderTotal = calculateOrderTotal(order.order_data);
                        
                        return (
                          <tr key={order._id || index}>
                            <td>{order.email}</td>
                            <td>
                              <div className="order-items">
                                {order.order_data && order.order_data.length > 0 ? (
                                  <ul>
                                    {order.order_data.map((item, idx) => {
                                      const qty = parseInt(item.qty) || 0;
                                      const price = parseFloat(item.price) || 0;
                                      const itemTotal = qty * price;
                                      return (
                                        <li key={idx}>
                                          {item.name} ({qty} × ₹{price} = ₹{itemTotal.toFixed(2)})
                                        </li>
                                      );
                                    })}
                                    <li className="order-total">
                                      <strong>Order Total: ₹{orderTotal.toFixed(2)}</strong>
                                    </li>
                                  </ul>
                                ) : (
                                  <span>No items</span>
                                )}
                              </div>
                            </td>
                            <td>{order.order_date}</td>
                            <td>
                              {order.location && order.location.latitude ? (
                                <div className="location-info">
                                  <p><strong>Lat:</strong> {order.location.latitude.toFixed(4)}</p>
                                  <p><strong>Lng:</strong> {order.location.longitude.toFixed(4)}</p>
                                  <p><strong>Address:</strong> {order.location.address || 'N/A'}</p>
                                </div>
                              ) : (
                                <span className="no-location">No location</span>
                              )}
                            </td>
                            <td className="action-column">
                              <button 
                                onClick={() => setSelectedOrder(order)}
                                className="btn-view-map"
                                title="View on map"
                              >
                                🗺️
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="no-items">No orders found</p>
              )}
            </div>

            {selectedOrder && (
              <div className="order-modal-overlay" onClick={() => setSelectedOrder(null)}>
                <div className="order-modal" onClick={(e) => e.stopPropagation()}>
                  <button className="modal-close" onClick={() => setSelectedOrder(null)}>✕</button>
                  <h3>📍 Order Location Map</h3>
                  <p><strong>Customer:</strong> {selectedOrder.email}</p>
                  {selectedOrder.location && selectedOrder.location.latitude && (
                    <>
                      <MapContainer 
                        center={[selectedOrder.location.latitude, selectedOrder.location.longitude]} 
                        zoom={15} 
                        style={{ height: '400px', width: '100%', borderRadius: '8px', marginBottom: '20px' }}
                      >
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution='&copy; OpenStreetMap contributors'
                        />
                        <Marker position={[selectedOrder.location.latitude, selectedOrder.location.longitude]}>
                          <Popup>
                            <div>
                              <strong>{selectedOrder.email}</strong>
                              <p>{selectedOrder.location.address}</p>
                            </div>
                          </Popup>
                        </Marker>
                      </MapContainer>
                      <div className="modal-location-info">
                        <h4>Location Details</h4>
                        <p><strong>Address:</strong> {selectedOrder.location.address}</p>
                        <p><strong>City:</strong> {selectedOrder.location.city}</p>
                        <p><strong>State:</strong> {selectedOrder.location.state}</p>
                        <p><strong>Latitude:</strong> {selectedOrder.location.latitude.toFixed(6)}</p>
                        <p><strong>Longitude:</strong> {selectedOrder.location.longitude.toFixed(6)}</p>
                        
                        <h4 style={{ marginTop: '20px' }}>Order Items</h4>
                        <div className="order-items-detailed">
                          {selectedOrder.order_data && selectedOrder.order_data.map((item, idx) => {
                            const qty = parseInt(item.qty) || 0;
                            const price = parseFloat(item.price) || 0;
                            const itemTotal = qty * price;
                            return (
                              <div key={idx} className="order-item-row">
                                <span>{item.name}</span>
                                <span>Qty: {qty}</span>
                                <span>Price: ₹{price}</span>
                                <span>Total: ₹{itemTotal.toFixed(2)}</span>
                              </div>
                            );
                          })}
                          {selectedOrder.order_data && selectedOrder.order_data.length > 0 && (
                            <div className="order-item-row order-total-row">
                              <span><strong>Grand Total:</strong></span>
                              <span></span>
                              <span></span>
                              <span><strong>₹{selectedOrder.order_data.reduce((total, item) => {
                                const qty = parseInt(item.qty) || 0;
                                const price = parseFloat(item.price) || 0;
                                return total + (qty * price);
                              }, 0).toFixed(2)}</strong></span>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
