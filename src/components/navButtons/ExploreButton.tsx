import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import c from 'classnames';
import s from './style.module.less';
import ExploreIcon from '../../resources/icons/explore.svg';

const ExploreButton = () => {
  const history = useHistory();

  const location = useLocation();
  const isOnLibraryPage = location.pathname.includes('explore');

  const onClick = () => {
    history.push({
      pathname: '/explore',
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
        data-qa="explore-button"
        className={s.headerButton}
      >
        <ExploreIcon className={s.navbarIcon} />
        <span>Explore</span>
      </button>
    </div>
  );
};

export default ExploreButton;
