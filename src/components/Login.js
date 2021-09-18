import React from 'react';
import { useHistory } from 'react-router-dom';
// import formText from '../utils/utils';
import AuthForm from './AuthForm';
import { login } from '../utils/auth';

// import InfoTooltip from './InfoTooltip';

export default function Login({ setLoggedIn, displayTooltip }) {
  const history = useHistory();
  // auth states
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  // tooltip states
  //   const [isSuccess, setIsSuccess] = React.useState(true);
  const authForm = React.useRef();

  //   const redirectPath = role === 'register' ? '/signin' : '/';

  //   React.useEffect(() => {
  //     setTimeout(() => {
  //       if (isTooltipOpen) {
  //         closeAllPopups();
  //       }
  //     }, 2000);
  //   }, [closeAllPopups, isTooltipOpen]);

  //   function updateSuccessMessage() {
  //     setToolTipActionText(role === 'login' ? 'logged in' : 'registered');
  //   }

  //   function displayTooltip(isSuccessful) {
  //     window.addEventListener('keydown', memoizedEscape);
  //     window.addEventListener('click', handleCloseOnOverlay);
  //     setIsSuccess(isSuccessful);
  //     updateInfoTooltipState(true);
  //   }

  function handleFormSubmit(e) {
    e.preventDefault();

    // prevent submission if form is invalid
    if (!authForm.current.checkValidity()) {
      authForm.current.reportValidity();
      return;
    }

    login(email, password)
      .then((res) => {
        if (res) {
          //   updateSuccessMessage();
          displayTooltip(true, 'logged in');
          setLoggedIn(true);
          setEmail('');
          setPassword('');
          history.push('/');
        } else {
          displayTooltip(false, '');
        }
      })
      .catch((error) => {
        displayTooltip(false, '');
      });
  }

  return (
    <AuthForm
      title="Log in"
      button="Log in"
      subtitle="Not a member yet? Sign up here!"
      path="/signup"
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      formRef={authForm}
      handleFormSubmit={handleFormSubmit}
    />
    // <div className="auth">
    //   <form action="login" className="auth__form" ref={authForm} onSubmit={handleFormSubmit}>
    //     <h1 className="auth__title">{title}</h1>
    //     <div className="auth__input-container">
    //       <input
    //         type="email"
    //         name="email"
    //         className="auth__input"
    //         value={email}
    //         placeholder="Email"
    //         onChange={(e) => setEmail(e.target.value)}
    //         required
    //       />
    //       <input
    //         type="password"
    //         name="password"
    //         className="auth__input"
    //         value={password}
    //         placeholder="Password"
    //         onChange={(e) => setPassword(e.target.value)}
    //         required
    //       />
    //     </div>
    //     <button type="submit" className="auth__button">
    //       {button}
    //     </button>
    //     <Link to={path} className="auth__subtitle">
    //       {subtitle}
    //     </Link>
    //   </form>
    //   {/* <InfoTooltip
    //     isOpen={isTooltipOpen}
    //     isSuccess={isSuccess}
    //     onClose={closeAllPopups}
    //     action={toolTipActionText}
    //   /> */}
    // </div>
  );
}
