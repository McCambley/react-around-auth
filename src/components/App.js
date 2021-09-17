import React from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ImagePopup from './ImagePopup';
import DeletePlacePopup from './DeletePlacePopup';
import ProtectedRoute from './ProtectedRoute';
import AuthorizationRoute from './AuthorizationRoute';
import InfoTooltip from './InfoTooltip';
import Error from './Error';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import api from '../utils/api';
import { register, login, validateUser } from '../utils/auth';
import AuthForm from './AuthForm';

function App() {
  // popup states
  const [isEditAvatarPopupOpen, updateAvatarPopupState] = React.useState(false);
  const [isEditProfilePopupOpen, updateEditProfilePopupState] = React.useState(false);
  const [isAddPlacePopupOpen, updateAddPlacePopupState] = React.useState(false);
  const [isDeletePlacePopupOpen, updateDeletePlacePopupState] = React.useState(false);
  const [isInfoToolTipOpen, updateInfoTooltipState] = React.useState(false);
  // UX states
  const [isLoading, updateLoading] = React.useState(true);
  const [isSubmitPending, updateSubmitPendingStatus] = React.useState(false);
  const [toolTipActionText, setToolTipActionText] = React.useState('');

  // card states
  const [selectedCard, updateSelectedCard] = React.useState(null);
  const [cardQueuedForDeletion, updateCardQueuedForDeletion] = React.useState(null);
  const [cards, updateCards] = React.useState([]);
  // user states
  const [currentUser, updateCurrentUser] = React.useState({});
  const [userEmail, setUserEmail] = React.useState('');
  // auth states
  const [loggedIn, setLoggedIn] = React.useState(false);
  const history = useHistory();

  const memoizedEscape = React.useCallback((evt) => {
    evt.key === 'Escape' && closeAllPopups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // React.useEffect(() => {});

  React.useEffect(() => {
    api
      .getGroupCards()
      .then((data) => {
        updateCards(data);
      })
      .catch((err) => console.error(`Problem fetching cards cards: ${err}`));
  }, []);

  React.useEffect(() => {
    api
      .getUserInfo()
      .then((res) => {
        updateCurrentUser(res);
        updateLoading(false);
      })
      .catch((err) => console.error(`Problem fetching user information: ${err}`));
  }, []);

  React.useEffect(() => {
    if (localStorage.getItem('token')) {
      validateUser()
        .then((res) => {
          setUserEmail(res.data.email);
          setLoggedIn(true);
        })
        .catch((err) => {
          console.error(`Validation error: ${err}`);
          handleLogout();
          history.push('/signin');
        });
    }
  }, [history, loggedIn]);

  function handleLogout() {
    localStorage.removeItem('token');
    setLoggedIn(false);
    setUserEmail('');
  }

  function handleAvatarClick() {
    updateAvatarPopupState(true);
    window.addEventListener('keydown', memoizedEscape);
    window.addEventListener('click', handleCloseOnOverlay);
  }

  function handleEditProfileClick() {
    updateEditProfilePopupState(true);
    window.addEventListener('keydown', memoizedEscape);
    window.addEventListener('click', handleCloseOnOverlay);
  }

  function handleAddPlaceClick() {
    updateAddPlacePopupState(true);
    window.addEventListener('keydown', memoizedEscape);
    window.addEventListener('click', handleCloseOnOverlay);
  }

  function handleCardClick(cardData) {
    updateSelectedCard(cardData);
    window.addEventListener('keydown', memoizedEscape);
    window.addEventListener('click', handleCloseOnOverlay);
  }

  function handleDeletePlaceClick(cardData) {
    updateDeletePlacePopupState(true);
    updateCardQueuedForDeletion(cardData);
    window.addEventListener('keydown', memoizedEscape);
    window.addEventListener('click', handleCloseOnOverlay);
  }

  function handleUpdateUser(userData) {
    updateSubmitPendingStatus(true);
    api
      .updateProfile(userData)
      .then((res) => {
        updateCurrentUser(res);
        closeAllPopups();
        updateSubmitPendingStatus(false);
      })
      .catch((err) => console.error(`Problem updating profile: ${err}`));
  }

  function handleUpdateAvatar(userData) {
    updateSubmitPendingStatus(true);
    api
      .updateAvatar(userData)
      .then((res) => {
        updateCurrentUser(res);
        closeAllPopups();
        updateSubmitPendingStatus(false);
      })
      .catch((err) => console.error(`Problem updating avatar: ${err}`));
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((like) => like._id === currentUser._id);
    api
      .changeLikeCardStatus(card._id, isLiked)
      .then((likedCard) => {
        updateCards(cards.map((cardItem) => (cardItem._id === card._id ? likedCard : cardItem)));
      })
      .catch((err) => console.error(`Problem updating 'like' status: ${err}`));
  }

  function handleDeletePlaceSubmit(card) {
    updateSubmitPendingStatus(true);
    api
      .deleteCard(card._id)
      .then((response) => {
        updateCards(cards.filter((stateCard) => stateCard !== card));
        closeAllPopups();
        updateSubmitPendingStatus(false);
      })
      .catch((err) => console.error(`Problem deleting card: ${err}`));
  }

  function handleAddPlaceSubmit(card) {
    updateSubmitPendingStatus(true);
    api
      .addCard(card)
      .then((newCard) => {
        updateCards([newCard, ...cards]);
        closeAllPopups();
        updateSubmitPendingStatus(false);
      })
      .catch((err) => console.error(`Problem adding new place: ${err}`));
  }

  function updateInputValidity(evt, inputValidityUpdater, errorMessageUpdater) {
    if (!evt.target.validity.valid) {
      inputValidityUpdater(false);
      errorMessageUpdater(evt.target.validationMessage);
    } else {
      inputValidityUpdater(true);
      errorMessageUpdater('');
    }
  }

  function closeAllPopups() {
    updateAvatarPopupState(false);
    updateEditProfilePopupState(false);
    updateAddPlacePopupState(false);
    updateDeletePlacePopupState(false);
    updateInfoTooltipState(false);
    updateSelectedCard(null);
    window.removeEventListener('keydown', memoizedEscape);
    window.removeEventListener('click', handleCloseOnOverlay);
  }

  function handleCloseOnOverlay(e) {
    e.target.classList.contains('popup') && closeAllPopups();
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Switch>
          <AuthorizationRoute path="/signin" loggedIn={loggedIn}>
            <Header loggedIn={loggedIn} navText="Sign up" path="/signup" userEmail={userEmail} />
            <AuthForm
              role="login"
              handleAuth={login}
              setLoggedIn={setLoggedIn}
              closeAllPopups={closeAllPopups}
              isTooltipOpen={isInfoToolTipOpen}
              updateInfoTooltipState={updateInfoTooltipState}
              toolTipActionText={toolTipActionText}
              setToolTipActionText={setToolTipActionText}
              memoizedEscape={memoizedEscape}
              handleCloseOnOverlay={handleCloseOnOverlay}
            />
          </AuthorizationRoute>
          <AuthorizationRoute path="/signup" loggedIn={loggedIn}>
            <Header loggedIn={loggedIn} navText="Log in" path="/signin" userEmail={userEmail} />
            <AuthForm
              role="register"
              handleAuth={register}
              setLoggedIn={setLoggedIn}
              closeAllPopups={closeAllPopups}
              isTooltipOpen={isInfoToolTipOpen}
              updateInfoTooltipState={updateInfoTooltipState}
              toolTipActionText={toolTipActionText}
              setToolTipActionText={setToolTipActionText}
              memoizedEscape={memoizedEscape}
              handleCloseOnOverlay={handleCloseOnOverlay}
            />
          </AuthorizationRoute>
          <ProtectedRoute exact path="/" loggedIn={loggedIn}>
            <Header
              loggedIn={loggedIn}
              handleLogout={handleLogout}
              navText="Log out"
              path="/signin"
              userEmail={userEmail}
            />
            <Main
              onEditAvatarClick={handleAvatarClick}
              onEditProfileClick={handleEditProfileClick}
              onAddPlaceClick={handleAddPlaceClick}
              onCardClick={handleCardClick}
              isLoading={isLoading}
              onCardLike={handleCardLike}
              onDeletePlaceClick={handleDeletePlaceClick}
              cards={cards}
            />
            <Footer />
            <EditProfilePopup
              isSubmitting={isSubmitPending}
              onUpdateUser={handleUpdateUser}
              isOpen={isEditProfilePopupOpen}
              onClose={closeAllPopups}
              checkValidity={updateInputValidity}
            />
            <AddPlacePopup
              isSubmitting={isSubmitPending}
              onAddPlace={handleAddPlaceSubmit}
              isOpen={isAddPlacePopupOpen}
              onClose={closeAllPopups}
              checkValidity={updateInputValidity}
            />
            <EditAvatarPopup
              isSubmitting={isSubmitPending}
              onUpdateAvatar={handleUpdateAvatar}
              isOpen={isEditAvatarPopupOpen}
              onClose={closeAllPopups}
              checkValidity={updateInputValidity}
            />
            <DeletePlacePopup
              isSubmitting={isSubmitPending}
              card={cardQueuedForDeletion}
              onDeletePlace={handleDeletePlaceSubmit}
              isOpen={isDeletePlacePopupOpen}
              onClose={closeAllPopups}
            />
            <ImagePopup card={selectedCard} onClose={closeAllPopups} />
            <InfoTooltip
              isOpen={isInfoToolTipOpen}
              onClose={closeAllPopups}
              isSuccess={true}
              action={toolTipActionText}
            />
          </ProtectedRoute>
          <Route path="/">
            <Header />
            <Error />
          </Route>
        </Switch>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
