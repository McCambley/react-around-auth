import logo from '../images/logo.svg';
import hamburgerOpen from '../images/hamburgerOpen.svg';
import hamburgerClose from '../images/hamburgerClose.svg';
import { Link } from 'react-router-dom';
import React from 'react';

export default function Header({ loggedIn, navText, handleNavClick, path }) {
  const [isHamburgerOpen, setIsHamburgerOpen] = React.useState(false);
  const email = 'Jakemccamb16@gmail.com';

  function handleHamburgerClick() {
    setIsHamburgerOpen(!isHamburgerOpen);
  }
  return (
    <>
      {/* fancy dropdown menu */}
      {loggedIn && (
        <div className={`header__dropdown ${isHamburgerOpen && 'header__dropdown_open'}`}>
          <p className="header__dropdown-email">{email}</p>
          <Link to={path} className="header__dropdown-link">
            {navText}
          </Link>
        </div>
      )}
      {/* rest of header */}
      <header className="header">
        <Link to="/">
          <img id="logo" src={logo} alt="Around the U.S." className="logo" />
        </Link>
        {loggedIn ? (
          <div>
            <nav className="header__nav-container">
              <p className="header__email">{email}</p>
              <Link to={path} className="header__link">
                {navText}
              </Link>
            </nav>
            <button className="header__hamburger" onClick={handleHamburgerClick}>
              <img
                src={!isHamburgerOpen ? hamburgerOpen : hamburgerClose}
                className="header__hamburger-icon"
                alt=""
              />
            </button>
          </div>
        ) : (
          <nav className="header__nav-container">
            <Link to={path} className="header__link header__link_loggedout">
              {navText}
            </Link>
          </nav>
        )}
      </header>
    </>
  );
}
