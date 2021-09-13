import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ImagePopup from './ImagePopup';
import DeletePlacePopup from './DeletePlacePopup';
import ProtectedRoute from './ProtectedRoute';
import Register from './Register';
import Login from './Login';
import InfoTooltip from './InfoTooltip';
import Error from './Error';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import api from '../utils/api';

function App() {
  const [isEditAvatarPopupOpen, updateAvatarPopupState] = React.useState(false);
  const [isEditProfilePopupOpen, updateEditProfilePopupState] = React.useState(false);
  const [isAddPlacePopupOpen, updateAddPlacePopupState] = React.useState(false);
  const [isDeletePlacePopupOpen, updateDeletePlacePopupState] = React.useState(false);
  const [isSubmitPending, updateSubmitPendingStatus] = React.useState(false);
  const [selectedCard, updateSelectedCard] = React.useState(null);
  const [cardQueuedForDeletion, updateCardQueuedForDeletion] = React.useState(null);
  const [isLoading, updateLoading] = React.useState(true);
  const [currentUser, updateCurrentUser] = React.useState({});
  const [cards, updateCards] = React.useState([]);
  const [loggedIn, setLoggedIn] = React.useState(true);

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

  function handleAvatarClick() {
    updateAvatarPopupState(true);
    window.addEventListener('keydown', handleCloseOnEscape);
    window.addEventListener('click', handleCloseOnOverlay);
  }

  function handleEditProfileClick() {
    updateEditProfilePopupState(true);
    window.addEventListener('keydown', handleCloseOnEscape);
    window.addEventListener('click', handleCloseOnOverlay);
  }

  function handleAddPlaceClick() {
    updateAddPlacePopupState(true);
    window.addEventListener('keydown', handleCloseOnEscape);
    window.addEventListener('click', handleCloseOnOverlay);
  }

  function handleCardClick(cardData) {
    updateSelectedCard(cardData);
    window.addEventListener('keydown', handleCloseOnEscape);
    window.addEventListener('click', handleCloseOnOverlay);
  }

  function handleDeletePlaceClick(cardData) {
    updateDeletePlacePopupState(true);
    updateCardQueuedForDeletion(cardData);
    window.addEventListener('keydown', handleCloseOnEscape);
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
    updateSelectedCard(null);
    window.removeEventListener('keydown', handleCloseOnEscape);
    window.removeEventListener('click', handleCloseOnOverlay);
  }

  function handleCloseOnEscape(e) {
    e.key === 'Escape' && closeAllPopups();
  }
  function handleCloseOnOverlay(e) {
    e.target.classList.contains('popup') && closeAllPopups();
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Switch>
          <Route path="/signin">
            <Header />
            <Login />
          </Route>
          <Route path="/signup">
            <Header />
            <Register />
          </Route>
          <ProtectedRoute exact path="/" loggedIn={loggedIn}>
            <Header />
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
