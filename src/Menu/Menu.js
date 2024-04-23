import React from 'react';
import { Link } from 'react-router-dom';

function Menu() {
  return (
    <div className="menu-container">
      <h2>ACCESS YOUR DASHBOARD</h2>
      <div className="menu-options">
        <div className='login-menu'>
          <h2>Already a user?</h2>
          <h3>Let's Login then!!</h3>
          <nav role="navigation" aria-label="Navigation Tab">
            <Link itemProp="url" to="/login">
              <button className='menu-btn'>Login</button>
            </Link>
          </nav>
        </div>
        <div className='signup-menu'>
          <h2>Not Here?</h2>
          <h3>Let's signup then!!</h3>
          <nav role="navigation" aria-label="Navigation Tab">
            <Link itemProp="url" to="/signup">
              <button className='menu-btn'>Signup</button>
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default Menu;
