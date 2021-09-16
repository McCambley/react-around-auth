import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import formText from '../utils/utils';
import InfoTooltip from './InfoTooltip';

export default function AuthForm({
  handleAuth,
  role,
  closeAllPopups,
  isTooltipOpen,
  updateInfoTooltipState,
  setToolTipActionText,
  toolTipActionText,
  setLoggedIn,
}) {
  const history = useHistory();
  // auth states
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  // tooltip states
  const [isSuccess, setIsSuccess] = React.useState(true);
  const authForm = React.useRef();

  const redirectPath = role === 'register' ? '/signin' : '/';

  const { title, button, subtitle, path } = formText[role];

  function updateSuccessMessage() {
    setToolTipActionText(role === 'login' ? 'logged in' : 'registered');
  }

  function displayTooltip(isSuccessful) {
    setIsSuccess(isSuccessful);
    updateInfoTooltipState(true);
    setTimeout(() => {
      updateInfoTooltipState(false);
    }, 2000);
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    // prevent submission if form is invalid
    if (!authForm.current.checkValidity()) {
      authForm.current.reportValidity();
      return;
    }

    handleAuth(email, password)
      .then((res) => {
        if (res) {
          updateSuccessMessage();
          setEmail('');
          setPassword('');
          role === 'login' && setLoggedIn(true);
          displayTooltip(true);
          history.push(redirectPath);
        } else {
          // display failure tooltip
          displayTooltip(false);
        }
      })
      .catch((error) => {
        displayTooltip(false);
      });
  }

  return (
    <div className="auth">
      <form action="login" className="auth__form" ref={authForm}>
        <h1 className="auth__title">{title}</h1>
        <div className="auth__input-container">
          <input
            type="email"
            name="email"
            className="auth__input"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            name="password"
            className="auth__input"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" onClick={handleFormSubmit} className="auth__button">
          {button}
        </button>
        <Link to={path} className="auth__subtitle">
          {subtitle}
        </Link>
      </form>
      <InfoTooltip
        isOpen={isTooltipOpen}
        isSuccess={isSuccess}
        onClose={closeAllPopups}
        action={toolTipActionText}
      />
    </div>
  );
}
