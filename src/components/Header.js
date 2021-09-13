import logo from '../images/logo.svg';
import { Link } from 'react-router-dom';

export default function Header({ loggedIn, navText, handleNavClick, path }) {
  const email = 'Jakemccamb16@gmail.com';
  return (
    <>
      {/* fancy dropdown menu */}
      {loggedIn && (
        <div className="header__dropdown header__dropdown_open">
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
          <nav className="header__nav-container">
            <p className="header__email">{email}</p>
            <Link to={path} className="header__link">
              {navText}
            </Link>
            <button className="header__hamburger" />
          </nav>
        ) : (
          <nav className="header__nav-container">
            <Link to={path} className="header__link">
              {navText}
            </Link>
          </nav>
        )}
      </header>
    </>
  );
}
