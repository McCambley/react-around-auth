import logo from '../images/logo.svg';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <>
      <header className="header">
        <Link to="/">
          <img id="logo" src={logo} alt="Around the U.S." className="logo" />
        </Link>
      </header>
    </>
  );
}
