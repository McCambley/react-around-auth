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
  const redirectPath = role === 'register' ? '/signin' : '/';

  React.useEffect(() => {
    setToolTipActionText(role === 'login' ? 'logged in' : 'registered');
  }, [role, setToolTipActionText]);

  const { title, button, subtitle, path } = formText[role];

  function handleFormSubmit(e) {
    e.preventDefault();
    handleAuth(email, password)
      .then((res) => {
        if (res) {
          console.log(res);
          setEmail('');
          setPassword('');
          setIsSuccess(true);
          updateInfoTooltipState(true);
          setLoggedIn(true);
          setTimeout(() => {
            updateInfoTooltipState(false);
          }, 1500);
          history.push(redirectPath);
        } else {
          // display failure tooltip
          setIsSuccess(false);
          updateInfoTooltipState(true);
        }
      })
      .catch((error) => {
        setIsSuccess(false);
        updateInfoTooltipState(true);
        console.log(error);
      });
  }

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
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            name="password"
            className="auth__input"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
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
