import logo from '../images/logo.svg';

export default function Header() {
  return (
    <>
      <header className="header">
        <img id="logo" src={logo} alt="Around the U.S." className="logo" />
      </header>
    </>
  );
}
