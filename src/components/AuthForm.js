import React from 'react';
import { Link } from 'react-router-dom';
import formText from '../utils/utils';

export default function AuthForm({ handleSubmit, role }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const { title, button, subtitle, path } = formText[role];

  return (
    <div className="auth">
      <form action="login" className="auth__form">
        <h1 className="auth__title">{title}</h1>
        <div className="auth__input-container">
          <input
            type="text"
            name="email"
            className="auth__input"
            value={email}
            placeholder="Email"
          />
          <input
            type="text"
            name="password"
            className="auth__input"
            value={password}
            placeholder="Password"
          />
        </div>
        <button type="submit" onClick={handleSubmit} className="auth__button">
          {button}
        </button>
        <Link to={path} className="auth__subtitle">
          {subtitle}
        </Link>
      </form>
    </div>
  );
}
