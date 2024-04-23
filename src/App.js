// Proj.js
import React, { useEffect } from 'react';
import './App.scss';

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from 'react-router-dom';

import Header from './Header/Header';
import Footer from './Footer/Footer';
import DashboardPage from './DashboardPage/DashboardPage';
import Login from './Login/Login';
import StartPage from './StartPage/StartPage';
import Signup from './Signup/Signup';
import NewCategory from './NewCategory/NewCategory';
import DeleteCategory from './DeleteCategory/DeleteCategory';
import { AuthProvider, useAuth } from './AuthProvider';


const PrivateRoute = ({ element, ...rest }) => {
  const { authenticated } = useAuth();
  if (authenticated === null) {
    return null;
  }

  if (authenticated) {
    return element;
  } else {
    return <Navigate to="/login" replace />;
  }
};

function App() {
  const { authenticated, setAuthenticated } = useAuth();

  useEffect(() => {
   
  }, [authenticated]);

  return (
    <Router>
      <div className="mainContainer">
        <Header />
        <Routes>
          <Route path="/" element={<StartPage />} />
          {/* <Route path="/login" element={<LoginPage  setAuthenticated={setAuthenticated} />} /> */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login setAuthenticated={setAuthenticated} />} />
          <Route path="/dashboard" element={<PrivateRoute element={<DashboardPage />} />} />
          {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
           <Route path="/newcategory" element={<PrivateRoute element={<NewCategory />} />} />
           {/* <Route path="/newcategory" element={<NewCategory />} /> */}
          <Route path="/deletecategory" element={<PrivateRoute element={<DeleteCategory />} />} /> 
          {/* <Route path="/deletecategory" element={<DeleteCategory />} /> */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

