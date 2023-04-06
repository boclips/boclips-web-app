import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import c from 'classnames';
import s from './newstyle.module.less';
import FilmIcon from '../../resources/icons/film-icon.svg';

const LibraryButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isOnVideosPage = location.pathname.includes('videos');

  const libraryOpenedEvent = () => {
    navigate({
      pathname: '/videos',
    });
  };

  return (
    <div className={c(s.navButton, { [s.active]: isOnVideosPage })}>
      <button
        type="button"
        onClick={libraryOpenedEvent}
        data-qa="cart-button"
        className={s.headerButton}
      >
        <FilmIcon className="h-6 w-6" />
        <span>All videos</span>
      </button>
    </div>
  );
};

export default LibraryButton;
