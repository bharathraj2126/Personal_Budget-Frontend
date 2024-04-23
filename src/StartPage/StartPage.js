import React from 'react';
import { Link } from 'react-router-dom';
import Menu from '../Menu/Menu';
import HomePage from '../HomePage/HomePage';
import Footer from '../Footer/Footer';
const StartPage = () => {
  return (
    <div className='startup'>
               <img className="img1" src="startpage5.jpg" alt="Logo" />
        <section className="side-by-side-sections">

        <div className="left-section">
          <h1 data-testid="cypress-title">Personal Budget App</h1>
          {/* <h3>A personal-budget management app</h3> */}
          <p>A place where you can record and analyze our daily and monthly expenses.</p>
          <div className="button-container">
           {/* <Menu/> */}
          </div>
        </div>
        <div className="right-section">
        <img src="startpage3.jpg" alt="Logo" />
        </div>
      </section>
      <Menu/>
      {/* <div className='Menu-class'>
        <section >
        <Menu/>
        </section>
      </div> */}
      <HomePage/>
    </div>
  );
}

export default StartPage;
