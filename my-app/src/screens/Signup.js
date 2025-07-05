import React, { useState } from 'react';
import '../App.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


export default function Signup() {

  const navigate = useNavigate(); // direct navigate to home page

  // State to store user input
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    repeatPassword: "",
    geolocation: ""
  });

  const [error, setError] = useState(""); // To show validation errors
  const [showPassword, setShowPassword] = useState(false); // Toggle for password field
  const [showRepeatPassword, setShowRepeatPassword] = useState(false); // Toggle for repeat password field

  // Handle input changes and password match check
  const onChange = (e) => {
    const { name, value } = e.target; // Destructure name and value from input event

    // Update the credentials state
    setCredentials((prev) => {
      const updated = { ...prev, [name]: value };

      // Check if password and repeatPassword match
      if ((name === "password" || name === "repeatPassword") && updated.password !== updated.repeatPassword) {
        setError("Passwords do not match");
      } else {
        setError("");
      }

      return updated;
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload on form submit

    // Check for password mismatch before sending data
    if (credentials.password !== credentials.repeatPassword) {
      setError("Passwords do not match");
      return;
    }


    // Send data to backend
    const response = await fetch('http://localhost:5000/api/createuser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' // Set headers to JSON
      },
      body: JSON.stringify({
        name: credentials.name,
        email: credentials.email,
        password: credentials.password,
        location: credentials.geolocation // location sent as expected by backend
      })
    });

    const json = await response.json(); // Parse response
    console.log(json); // Log for debugging

    // You can add redirection or alert here if needed
    if (!json.success) {
      if (json.errors && json.errors.length > 0) {
        alert(`❌ ${json.errors[0].msg}`);
      } else {
        alert(`❌ ${json.error || "Registration failed."}`);
      }
    } else {
      alert(" Registration successful!");
      navigate('/');
    }

  };

  return (
    <>
      {/* Signup page layout with background image */}
      <section
        className="vh-100 bg-image"
        style={{ backgroundImage: "url('https://mdbcdn.b-cdn.net/img/Photos/new-templates/search-box/img4.webp')" }}
      >
        <div className="mask d-flex align-items-center h-100 gradient-custom-3">
          <div className="container h-100">
            <div className="row d-flex justify-content-center align-items-center h-100">
              <div className="col-12 col-md-9 col-lg-7 col-xl-6">
                <div className="card" style={{ borderRadius: '15px' }}>
                  <div className="card-body p-5">
                    {/* Form heading */}
                    <h2 className="text-uppercase text-center mb-5">Create an account</h2>

                    {/* Signup form */}
                    <form onSubmit={handleSubmit}>

                      {/* Name field */}
                      <div className="form-outline mb-4">
                        <input
                          type="text"
                          name="name"
                          value={credentials.name}
                          onChange={onChange}
                          id="name"
                          className="form-control form-control-lg"
                        />
                        <label className="form-label" htmlFor="name">Your Name</label>
                      </div>

                      {/* Email field */}
                      <div className="form-outline mb-4">
                        <input
                          type="email"
                          name="email"
                          value={credentials.email}
                          onChange={onChange}
                          id="email"
                          className="form-control form-control-lg"
                        />
                        <label className="form-label" htmlFor="email">Your Email</label>
                      </div>

                      {/* Location field */}
                      <div className="form-outline mb-4">
                        <input
                          type="text"
                          name="geolocation"
                          value={credentials.geolocation}
                          onChange={onChange}
                          id="location"
                          className="form-control form-control-lg"
                        />
                        <label className="form-label" htmlFor="location">Your Location</label>
                      </div>

                      {/* Password field with eye toggle */}
                      <div className="form-outline mb-4 position-relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={credentials.password}
                          onChange={onChange}
                          id="password"
                          className="form-control form-control-lg"
                        />
                        <label className="form-label" htmlFor="password">Password</label>

                        {/* Eye icon to toggle visibility */}
                        <span
                          onClick={() => setShowPassword(prev => !prev)}
                          style={{
                            position: 'absolute',
                            top: '50%',
                            right: '15px',
                            transform: 'translateY(-50%)',
                            cursor: 'pointer',
                            fontSize: '18px'
                          }}
                        >
                          {showPassword ? '🙈' : '👁️'}
                        </span>
                      </div>

                      {/* Repeat Password field with eye toggle */}
                      <div className="form-outline mb-4 position-relative">
                        <input
                          type={showRepeatPassword ? "text" : "password"}
                          name="repeatPassword"
                          value={credentials.repeatPassword}
                          onChange={onChange}
                          id="repeatPassword"
                          className="form-control form-control-lg"
                        />
                        <label className="form-label" htmlFor="repeatPassword">Repeat your password</label>

                        {/* Eye icon to toggle repeat password */}
                        <span
                          onClick={() => setShowRepeatPassword(prev => !prev)}
                          style={{
                            position: 'absolute',
                            top: '50%',
                            right: '15px',
                            transform: 'translateY(-50%)',
                            cursor: 'pointer',
                            fontSize: '18px'
                          }}
                        >
                          {showRepeatPassword ? '🙈' : '👁️'}
                        </span>
                      </div>

                      {/* Show password mismatch error if exists */}
                      {error && (
                        <div className="alert alert-danger" role="alert">
                          {error}
                        </div>
                      )}

                      {/* Terms of service checkbox */}
                      <div className="form-check d-flex justify-content-center mb-5">
                        <input
                          className="form-check-input me-2"
                          type="checkbox"
                          value=""
                          id="terms"
                        />
                        <label className="form-check-label" htmlFor="terms">
                          I agree all statements in <a href="#!" className="text-body"><u>Terms of service</u></a>
                        </label>
                      </div>

                      {/* Register button, disabled if error exists */}
                      <div className="d-flex justify-content-center">
                        <button
                          type="submit"
                          className="btn btn-success btn-block btn-lg gradient-custom-4 text-body"
                          disabled={!!error}
                        >
                          Register
                        </button>
                      </div>

                      {/* Link to login page */}
                      <p className="text-center text-muted mt-5 mb-0">
                        Have already an account?{' '}
                        <Link to="/login" className="fw-bold text-body"><u>Login here</u></Link>
                      </p>

                    </form>
                    {/* End of form */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
