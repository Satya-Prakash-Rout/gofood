import React, { useState } from 'react';
import '../App.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../CSS/Login.css';

export default function Login() {

  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const endpoint = 'http://localhost:5000/api/loginuser';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password
        })
      });

      const json = await response.json();
      console.log(json);
      if (!json.success) {
        if (json.error) {
          alert(`${json.error}`);
        } else {
          alert("Login failed. Please check your credentials.");
        }
      } else {
        alert('User login successful!');
        localStorage.setItem("userEmail", credentials.email);
        localStorage.setItem("authToken", json.authToken);
        navigate('/');
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Server error. Please try again later.");
    }
  };

  const onChange = (event) => {
    const { name, value } = event.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <section
        className="vh-100 bg-image"
        style={{ backgroundImage: "url('https://mdbcdn.b-cdn.net/img/Photos/new-templates/search-box/img4.webp')" }}
      >
        <div className="mask d-flex align-items-center h-100 gradient-custom-3">
          <div className="container h-100">
            <div className="row d-flex justify-content-center align-items-center h-100">
              <div className="col-12 col-md-9 col-lg-7 col-xl-6">
                <div className="card login-card" style={{ borderRadius: '15px' }}>
                  <div className="card-body p-5">
                    <h2 className="text-uppercase text-center mb-4">Login</h2>

                    <form onSubmit={handleSubmit}>

                      <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="loginEmail">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={credentials.email}
                          onChange={onChange}
                          id="loginEmail"
                          className="form-control form-control-lg"
                          required
                        />
                      </div>

                      <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="loginPassword">Password</label>
                        <input
                          type="password"
                          name="password"
                          value={credentials.password}
                          onChange={onChange}
                          id="loginPassword"
                          className="form-control form-control-lg"
                          required
                        />
                      </div>

                      <div className="d-flex justify-content-center">
                        <button
                          type="submit"
                          className="btn btn-success btn-block btn-lg gradient-custom-4 text-body"
                        >
                          Login as User
                        </button>
                      </div>

                      <p className="text-center text-muted mt-5 mb-0">
                        Don't have an account?{' '}
                        <Link to="/createuser" className="fw-bold text-body"><u>Register here</u></Link>
                      </p>

                      <div className="d-flex justify-content-center mt-4">
                        <button
                          type="button"
                          className="btn btn-info btn-lg"
                          onClick={() => navigate('/admin/login')}
                        >
                          🛡️ Admin Login
                        </button>
                      </div>

                    </form>

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
