import { Form, Input, Button, Checkbox } from 'antd'; // Import Ant Design components
import React, { useState,useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [isPopupOpen, setPopupOpen] = useState(false);
    const [popupTimer, setPopupTimer] = useState(null);
    const navigate = useNavigate();
  
    function handleSubmit(event) {
      event.preventDefault();
    
      axios.post(' https://jellyfish-app-c3gkm.ondigitalocean.app/api/signup', { email, password, username, name })
        .then(res => {
          if (res && res.data && res.data.success) {
            setPopupOpen(true);
    
            // Close the popup after a certain duration (e.g., 3 seconds)
            const timer = setTimeout(() => {
              setPopupOpen(false);
              
              // Navigate to login page after closing the popup
              navigate('/login');
            }, 3000);
    
            // Save the timer in state to clear it if needed
            setPopupTimer(timer);
          }
        })
        .catch(err => console.error(err));
    }
    
  
    // Clear the popup timer when the component is unmounted
    useEffect(() => {
      return () => {
        if (popupTimer) {
          clearTimeout(popupTimer);
        }
      };
    }, [popupTimer]);
  
    function handleBackToRoot() {
      navigate('/'); // Update the route to your dashboard route
    }
  return (
    <div className="login-page">
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'></link>
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'></link>
      <button className="back" onClick={handleBackToRoot}>
        <i className='bx bxs-left-arrow-alt' ></i>
        Back to HomePage
      </button>
      <div className="signup-box">
        <div className="illustration-wrapper">
          <img src="loginpic.png" alt="Login" />
        </div>
          <form id="login-form" onSubmit={handleSubmit}>
          <p className="form-title">New Here?</p>
          <p>Signup to the Dashboard</p>
          <div className="input-box">
            <input type="text" placeholder='Name' value={name} onChange={e => setName(e.target.value)} required />&nbsp;
            <i className='bx bxs-user'></i>
          </div>
          <div className="input-box">
            <input type="text" placeholder='Email' value={email} onChange={e => setEmail(e.target.value)} required />&nbsp;
            <i className='bx bxs-envelope'></i>
          </div>
          <div className="input-box">
            <input type="text" placeholder='Username' value={username} onChange={e => setUsername(e.target.value)} required />&nbsp;
            <i className='bx bxs-user'></i>
          </div>
          <div className="input-box">
            <input type="password" placeholder='Password' value={password} onChange={e => setPassword(e.target.value)} required />&nbsp;
            <i className='bx bxs-lock-alt'></i>
          </div>
          <button id="login" type="submit" className="login-form-button">Sign Up</button>
          <br/><br/>
          <div className="createacc">
            Already have an account?&nbsp;
            <Link itemProp="url" to="/login">Login Here</Link>
          </div>

        </form>
      </div>
      {isPopupOpen && (
        <div className="popup">
          <div className="popup-content">
            <p>Account has been created successfully!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
