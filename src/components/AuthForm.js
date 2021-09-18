import React from 'react';
import { Link } from 'react-router-dom';
// import formText from '../utils/utils';
// import InfoTooltip from './InfoTooltip';

export default function AuthForm({
  title,
  button,
  subtitle,
  path,
  email,
  setEmail,
  password,
  setPassword,
  formRef,
  handleFormSubmit,
}) {
  return (
    <div className="auth">
      <form action="login" className="auth__form" ref={formRef} onSubmit={handleFormSubmit}>
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
        <button type="submit" className="auth__button">
          {button}
        </button>
        <Link to={path} className="auth__subtitle">
          {subtitle}
        </Link>
      </form>
    </div>
  );
}

// const history = useHistory();
// // auth states
// const [email, setEmail] = React.useState('');
// const [password, setPassword] = React.useState('');
// // tooltip states
// const [isSuccess, setIsSuccess] = React.useState(true);
// const authForm = React.useRef();

// const redirectPath = role === 'register' ? '/signin' : '/';
// const { title, button, subtitle, path } = formText[role];

// React.useEffect(() => {
//   setTimeout(() => {
//     if (isTooltipOpen) {
//       closeAllPopups();
//     }
//   }, 2000);
// }, [closeAllPopups, isTooltipOpen]);

// function updateSuccessMessage() {
//   setToolTipActionText(role === 'login' ? 'logged in' : 'registered');
// }

// function displayTooltip(isSuccessful) {
//   window.addEventListener('keydown', memoizedEscape);
//   window.addEventListener('click', handleCloseOnOverlay);
//   setIsSuccess(isSuccessful);
//   updateInfoTooltipState(true);
// }

// function handleFormSubmit(e) {
//   e.preventDefault();

//   // prevent submission if form is invalid
//   if (!authForm.current.checkValidity()) {
//     authForm.current.reportValidity();
//     return;
//   }

//   handleAuth(email, password)
//     .then((res) => {
//       if (res) {
//         updateSuccessMessage();
//         displayTooltip(true);
//         role === 'login' && setLoggedIn(true);
//         setEmail('');
//         setPassword('');
//         history.push(redirectPath);
//       } else {
//         // display failure tooltip
//         console.log("what's going on here?");
//         displayTooltip(false);
//       }
//     })
//     .catch((error) => {
//       displayTooltip(false);
//     });
// }

/* <InfoTooltip
                        isOpen={isTooltipOpen}
                        isSuccess={isSuccess}
                        onClose={closeAllPopups}
                        action={toolTipActionText}
                      /> */
