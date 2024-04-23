import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function DeleteCategory() {
  const [title, setTitle] = useState('');
  const [month, setMonth] = useState('');
  const [existingTitles, setExistingTitles] = useState([]);
  const [titlesMap , setTitlesMap] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const [token, setToken] = useState(localStorage.getItem('jwt') || '');
  const [dataSource, setDataSource] = useState({
    datasets: [
      {
        data: [],
        backgroundColor: [],
        expense: [],
        month: [],
      },
    ],
    labels: [],
  });
  const [monthsMap, setMonthsMap] = useState({});

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
    console.log('LoginPage - Initial Authenticated:', token);
    if (token) {
      const decodedToken = decodingJWT(token);
      const issuedAt = decodedToken.iat;
      const expiresIn = decodedToken.exp - issuedAt;
      console.log('LoginPage - expiresIn:', expiresIn);
      const currentTimeInSeconds = Math.floor(Date.now() / 1000);
      console.log('currentTimeInSeconds:', currentTimeInSeconds);
      const warningTime = expiresIn - 20;
      const warningTimeout = setTimeout(() => {
        const userResponse = window.confirm('Your session will expire in 20 seconds. Do you want to continue?');

        if (!userResponse || currentTimeInSeconds - issuedAt > expiresIn) {
          // User clicked 'Cancel', logout the user
          localStorage.removeItem('jwt');
          localStorage.removeItem('username');
          setToken('');
          window.location.reload();
        }
      }, warningTime * 1000);
   
      return () => clearTimeout(warningTimeout);
    }
  }, [token]);

  const getBudget = () => {
    axios
      .get(`https://jellyfish-app-c3gkm.ondigitalocean.app/api/budget/${username}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (res) {
        console.log(res.data);
        for (var i = 0; i < res.data.length; i++) {
          dataSource.datasets[0].data[i] = res.data[i].budget;
          dataSource.labels[i] = res.data[i].title;
          dataSource.datasets[0].backgroundColor[i] = res.data[i].color;
          dataSource.datasets[0].expense[i] = res.data[i].expense;
          dataSource.datasets[0].month[i] = res.data[i].month;
        }
      })
      .catch(function (error) {
        console.error('Error fetching budget data:', error);
      });
  };

  useEffect(() => {
    getBudget();
  }, [token]);

  function handleBackToDashboard() {
    navigate('/dashboard');
  }

  function handleSubmit(event) {
    event.preventDefault();

    axios
      .post(
        ' https://jellyfish-app-c3gkm.ondigitalocean.app/deletebudget',
        {
          title,
          username,
          month,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        if (res.data.success) {
          setPopupOpen(true);
          setTimeout(() => {
            setPopupOpen(false);
          }, 3000);
        }
      })
      .catch((err) => console.error(err));
  }

  const getTitles = () => {
    axios
      .get(`https://jellyfish-app-c3gkm.ondigitalocean.app/gettitles/${username}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const titlesMap = {};

        res.data.forEach(({ title, month }) => {
          if (!titlesMap[title]) {
            titlesMap[title] = [];
          }

          titlesMap[title].push(month);
        });
        console.log('titlesMap--', titlesMap);
        
        setMonthsMap(titlesMap);
        setExistingTitles(Object.keys(titlesMap));
        setTitlesMap(titlesMap);
      })
      .catch((error) => {
        console.error('Error fetching titles data:', error);
      });
  };

  useEffect(() => {
    getTitles();
  }, [token]);

  const getMonthsForTitle = (selectedTitle) => {
    console.log('titlesMap[selectedTitle]--',titlesMap[selectedTitle]);
    return titlesMap[selectedTitle] || [];
  };  

  return (
    <div className="new-category">
      <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'></link>
      <button className="back" onClick={handleBackToDashboard}>
        <i className='bx bxs-left-arrow-alt'></i>
        Back to Dashboard
      </button>
      <section className="newcat">
        <form onSubmit={handleSubmit}>
          <h1>Delete Categories</h1>
          <div className="input-box">
            <label htmlFor="title">Title:</label>
            <select
              id="title"
              onChange={(e) => {
                setTitle(e.target.value);
                setMonth(''); 
              }}
              required
            >
              <option value="" disabled selected>
                Select Title
              </option>
              {existingTitles.map((existingTitle, index) => (
                <option key={`${existingTitle}-${index}`} value={existingTitle}>
                  {existingTitle}
                </option>
              ))}
            </select>
          </div>
          <div className="input-box">
  <label htmlFor="month">Month:</label>
  <select
    id="month"
    onChange={(e) => setMonth(e.target.value)}
    required
    disabled={!title}
  >
    <option value="" disabled selected>
      Select Month
    </option>
    {getMonthsForTitle(title).map((month) => (
      <option key={`${title}-${month}`} value={month}>
        {month}
      </option>
    ))}
  </select>
</div>
          <button id="delete" type="submit" className="btn">
            Delete
          </button>
        </form>
      </section>

      {isPopupOpen && (
        <div className="popup">
          <div className="popup-content">
            <p>Data has been deleted successfully!</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeleteCategory
