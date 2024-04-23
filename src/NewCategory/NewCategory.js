import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function NewCategory() {
  const [title, setTitle] = useState('');
  const [budget, setBudget] = useState('');
  const [color, setColor] = useState('');
  const [expense, setExpense] = useState('');
  const [month, setMonth] = useState('');
  const [isPopupOpen, setPopupOpen] = useState(false);
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const token = localStorage.getItem('jwt');
  function decodingJWT(token) {
    try {
      const base64payload = (token.split('.')[1]).replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64payload).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return {};
    }
  }

  useEffect(() => {
    console.log('LoginPage - Initial Authenticated:', localStorage.getItem('jwt'));
    const existingToken = localStorage.getItem('jwt');
    if (existingToken) {
      const decodedToken = decodingJWT(existingToken);
      const issuedAt = decodedToken.iat;
      const expiresIn = decodedToken.exp - issuedAt;
      console.log('LoginPage - expiresIn:', expiresIn);
      const currentTimeInSeconds = Math.floor(Date.now() / 1000);
      console.log('currentTimeInSeconds::', currentTimeInSeconds);
      // Show a warning popup 20 seconds before the token expires
      const warningTime = expiresIn - 20;
      const warningTimeout = setTimeout(() => {
        const userResponse = window.confirm('Your session will expire in 20 seconds. Do you want to continue?');

        if (!userResponse || currentTimeInSeconds - issuedAt > expiresIn) {
          // User clicked 'Cancel', logout the user

          localStorage.removeItem('jwt');
          localStorage.removeItem('username');
          window.location.reload();
        }
      }, warningTime * 1000);
      // Clear the warning timeout when the component unmounts
      return () => clearTimeout(warningTimeout);
    }
  }, []);

  function handleBackToDashboard() {
    navigate('/dashboard'); // Update the route to your dashboard route
  }

  function handleSubmit(event) {
    event.preventDefault();
    console.log(title, budget, color, expense);

    axios.post('https://jellyfish-app-c3gkm.ondigitalocean.app/addbudget',
      {
        title,
        budget,
        color,
        expense,
        username,
        month
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => {
        console.log(res.data);
        console.log(res.data.success);
        if (res && res.data && res.data.success) {
         
          setPopupOpen(true);

          setTimeout(() => {
            setPopupOpen(false);
          }, 3000);
        }
      })
      .catch((err) => console.error(err));
  }

  return (
    <div className="new-category">
      <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'></link>
      <button className="back" onClick={handleBackToDashboard}>
        <i className='bx bxs-left-arrow-alt' ></i>
        Back to Dashboard
      </button>
      <section className="newcat">
        <form onSubmit={handleSubmit}>
          <h1>Add/Update Categories</h1>
          <div className="input-box">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              placeholder="Enter Title"
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="input-box">
            <label htmlFor="budget">Total Budget:</label>
            <input
              type="text"
              id="budget"
              placeholder="Enter Total Budget in Numbers"
              onChange={(e) => setBudget(e.target.value)}
              required
            />
          </div>
          <div className="input-box">
            <label htmlFor="color">Color:</label>
            <input
              type="text"
              id="color"
              placeholder="Enter Color as String/Hexacode"
              onChange={(e) => setColor(e.target.value)}
              required
            />
          </div>
          <div className="input-box">
            <label htmlFor="expense">Expense:</label>
            <input
              type="text"
              id="expense"
              placeholder="Enter Expense in Numbers"
              onChange={(e) => setExpense(e.target.value)}
              required
            />
          </div>
          <div className="input-box">
            <label htmlFor="month">Month:</label>
            <select
              id="month"
              onChange={(e) => setMonth(e.target.value)}
              required
            >
              <option value="" disabled selected>Select Month</option>
              <option value="Jan">January</option>
              <option value="Feb">February</option>
              <option value="Mar">March</option>
              <option value="Apr">April</option>
              <option value="May">May</option>
              <option value="Jun">June</option>
              <option value="Jul">July</option>
              <option value="Aug">August</option>
              <option value="Sep">September</option>
              <option value="Oct">October</option>
              <option value="Nov">November</option>
              <option value="Dec">December</option>
            </select>
          </div>
          <button id="add" type="submit" className="btn">
            Add / Update
          </button>
        </form>
      </section>

      {/* Popup */}
      {isPopupOpen && (
        <div className="popup">
          <div className="popup-content">
            <p>Data has been created successfully!</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default NewCategory;
