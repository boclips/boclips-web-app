import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import c from 'classnames';
import s from './style.module.less';
import YourLibraryIcon from '../../resources/icons/your-library.svg';

const LibraryButton = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const isOnLibraryPage = location.pathname.includes('library');

  const onClick = () => {
    navigate({
      pathname: '/library',
    });
  };

  return (
    <div
      className={c(s.navButton, {
        [s.active]: isOnLibraryPage,
      })}
    >
      <button
        type="button"
        onClick={onClick}
        data-qa="library-button"
        className={s.headerButton}
      >
        <YourLibraryIcon className={s.navbarIcon} />
        <span>Your Library</span>
        <span className="sr-only"> find your playlists here</span>
      </button>
    </div>
  );
};

export default LibraryButton;
