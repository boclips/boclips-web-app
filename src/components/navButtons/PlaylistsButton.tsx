import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import c from 'classnames';
import s from './style.module.less';
import YourLibraryIcon from '../../resources/icons/your-library.svg';

const PlaylistsButton = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const isOnLibraryPage = location.pathname.includes('playlists');

  const onClick = () => {
    navigate({
      pathname: '/playlists',
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
        data-qa="playlist-button"
        className={s.headerButton}
      >
        <YourLibraryIcon className={s.navbarIcon} />
        <span>Playlists</span>
        <span className="sr-only"> find your playlists here</span>
      </button>
    </div>
  );
};

export default PlaylistsButton;
