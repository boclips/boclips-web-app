import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import c from 'classnames';
import s from './style.module.less';
import YourLibraryIcon from '../../resources/icons/your-library.svg';

const LibraryButton = () => {
  const history = useHistory();

  const location = useLocation();
  const isOnLibraryPage = location.pathname.includes('library');

  const onClick = () => {
    history.push({
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
